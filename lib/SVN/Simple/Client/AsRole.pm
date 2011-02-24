package SVN::Simple::Client::AsRole;

# ABSTRACT: Simplified Subversion client as a Moose role

use strict;
use Carp;
use Devel::Symdump;
use English '-no_match_vars';
use Log::Log4perl ':easy';
use Moose::Role;
use MooseX::Has::Sugar;
use MooseX::Types::Moose qw(ArrayRef CodeRef Maybe Object Ref Str);
use MooseX::Types::Path::Class 'Dir';
use MooseX::Types::URI 'Uri';
use Readonly;
use SVN::Client;
use SVN::Simple::Client::Constants ':all';
use SVN::Simple::Client::Types qw(Revision SvnError SvnUri);
use TryCatch;
use URI;
use namespace::autoclean;
with 'MooseX::Getopt';
with 'MooseX::Log::Log4perl';

BEGIN { Log::Log4perl->easy_init() }

=attr username

User name for connection to the Subversion repository.

=attr password

Password for connection to the Subversion repository.

=cut

for my $attr (qw(username password)) {
    has $attr => ( rw,
        isa           => Str,
        predicate     => "has_$attr",
        documentation => 'authentication for the Subversion repository',
        trigger => sub { $ARG[0]->context->auth( $ARG[0]->auth_baton ) },
    );
}

=attr url

URL (sometimes spelled URI) of the Subversion repository, as an
L<SvnUri|SVN::Simple::Client::Types/SvnUri>.
Defaults to the URL of the current L</working_copy>.

=method has_url

Predicate method that returns true if the L</url> attribute is set.

=cut

has url => ( rw, coerce, lazy_build,
    isa           => SvnUri,
    documentation => 'location of the Subversion repository',
    predicate     => 'has_url',
);

sub _build_url {
    my $self = shift;
    my $url;
    $self->context->info( $self->working_copy->stringify,
        undef, undef, sub { $url = URI->new($ARG[1]->URL) }, 0 );
    return $url;
}

=attr working_copy

=cut

has working_copy => ( rw, required, coerce,
    isa           => Dir,
    documentation => 'directory for checkouts/updates',
);

=attr context

Accessor to the underlying L<SVN::Client|SVN::Client> object.
Useful if you want to directly access the methods that are wrapped by this
module.

Uses L</auth_baton> for authentication and L</notify_callback> for event
notification.

=cut

has context => ( ro, required, lazy_build,
    isa      => 'SVN::Client',
    init_arg => undef,
    traits   => ['NoGetopt'],
);

sub _build_context {    ## no critic (ProhibitUnusedPrivateSubroutines)
    my $self = shift;
    my %params = ( notify => $self->notify_callback() );
    if ( $self->has_username ) { $params{auth} = $self->auth_baton }
    return SVN::Client->new(%params);
}

=attr auth_baton

Reference to an array of Subversion authentication providers, as described
in the
L<SVN::Client notify|SVN::Client/"$ctx->auth(SVN::Client::get_username_provider());">
attribute.

Defaults to a chain of providers that first tries information from
L<previously-cached sessions|SVN::Client/SVN::Client::get_simple_provider>,
then falls back to a
L<simple username/password prompt|SVN::Client/SVN::Client::get_simple_prompt_provider>.

=cut

has auth_baton => ( rw, lazy_build,
    isa => ArrayRef [Ref],
    traits  => ['NoGetopt'],
    trigger => sub { $ARG[0]->context->auth( $ARG[1] ) },
);

sub _build_auth_baton {    ## no critic (ProhibitUnusedPrivateSubroutines)
    my $self = shift;
    return [
        ## no critic (ProhibitCallsToUnexportedSubs)
        SVN::Client::get_simple_provider(),
        SVN::Client::get_simple_prompt_provider(
            sub {
                my $cred = shift;
                for (qw(username password)) { $cred->$ARG( $self->$ARG ) }
                $cred->may_save(1);
                return;
            },
            1,
        ),
        SVN::Client::get_username_provider(),
    ];
}

=attr notify_callback

Code reference to a subroutine that is called when a change is made to the
working copy, as described in the
L<SVN::Client notify|SVN::Client/"$ctx->notify(\&notify);"> attribute.

Defaults to logging each change at the INFO level via L</logger>.

=cut

has notify_callback => ( rw, lazy_build,
    isa     => CodeRef,
    traits  => ['NoGetopt'],
    trigger => sub { $ARG[0]->context->notify( $ARG[1] ) },
);

sub _build_notify_callback {   ## no critic (ProhibitUnusedPrivateSubroutines)
    my $self = shift;
    return sub {
        my ( $path, $action, $node_kind, $mime, $state, $revision_num )
            = @ARG;

        $self->logger->info(
            join(
                q{ },
                grep {$ARG} (
                    $ACTION_NAME{$action},  $STATE_NAME{$state},
                    $NODE_NAME{$node_kind}, $path,
                    "r$revision_num",
                ),
            ),
        );
        return;
    };
}

=attr commit_log

Sets the log message for any commits to the repository.

=cut

has commit_log => ( rw,
    isa           => Str,
    init_arg      => undef,
    documentation => 'log message to use for any commits',
    trigger       => sub {
        my $message = "@ARG[1..$#ARG]";
        $ARG[0]->context->log_msg( sub { ${ $ARG[0] } = $message } );
    },
);

=attr revision

I<(Copied from the L<SVN::Client documentation for the
C<$revision> parameter|SVN::Client/"Parameter Notes">.)>

This specifies a revision in the subversion repository.  You can specify a
revision in several ways.  The easiest and most obvious is to directly
provide the revision number.  You may also use the strings (aka revision
keywords) C<HEAD>, C<BASE>, C<COMMITTED>, and C<PREV> which have the same
meanings as in the command line client.  When referencing a working copy
you can use the string C<WORKING> to reference the I<BASE> plus any local
modifications.  C<undef> may be used to specify an unspecified revision.
Finally you may pass a date by specifying the date inside curly braces
C<{}>.  The date formats accepted are the same as the command line client
accepts.

Defaults to C<HEAD>.

=cut

has revision => ( rw, required, coerce,
    isa           => Revision,
    default       => 'HEAD',
    documentation => 'revision in the Subversion repository',
);

=method update_or_checkout

Populates the L</working_copy> directory with the L</revision> version of
the repository at L</url>.  If the working copy is found not to be a directory
then a new checkout is made.

=cut

sub update_or_checkout {
    my $self = shift;

    my $ctx = $self->context;
    my $wc  = $self->working_copy->stringify();

    my $error;
    try {
        ## no critic (ProhibitPackageVars,ProhibitCallsToUnexportedSubs)
        local $SVN::Error::handler = undef;
        my @out = $ctx->update( $wc, $self->revision, 1 );
        croak $out[0]->quick_wrap('update attempt failed')
            if SVN::Error::is_error( $out[0] );
    }
    catch( SvnError $error
            where { $ARG->apr_err == $SVN::Error::WC_NOT_DIRECTORY } ) {
        croak $error->quick_wrap('no URL for checkout')
            if !$self->has_url;
        $error->clear();
            $ctx->checkout(
            $self->url->as_string(), $wc, $self->revision, 1
            );
            };

    return;
}

1;

__END__

=head1 DESCRIPTION

Role for Moose-based Subversion clients

=head1 SYNOPSIS

    package My::Class;

    use Moose;
    with 'SVN::Simple::Client::AsRole';

    my $svn = SVN::Simple::Client->new(
        username     => 'mjg',
        password     => 'MYPASSWORD',
        working_copy => './checkout',
        url          => 'http://sample.com/svn/repo/trunk',
    );
