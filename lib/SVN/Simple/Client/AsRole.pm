package SVN::Simple::Client::AsRole;

# ABSTRACT: Simplified Subversion client as a Moose role

use strict;
use Carp;
use Devel::Symdump;
use English '-no_match_vars';
use Log::Log4perl ':easy';
use Moose::Role;
use MooseX::Has::Sugar;
use MooseX::Types::Moose qw(ArrayRef CodeRef Object Ref Str);
use MooseX::Types::Path::Class 'Dir';
use MooseX::Types::URI 'Uri';
use Readonly;
use SVN::Client;
use SVN::Simple::Client::Constants ':all';
use SVN::Simple::Client::Types qw(Revision SvnError SvnUri);
use TryCatch;
use URI;
use namespace::autoclean;
with 'MooseX::Log::Log4perl';

BEGIN { Log::Log4perl->easy_init() }

=attr username

User name required to connect to the Subversion repository.

=attr password

Password required to connect to the Subversion repository.

=cut

has [qw(username password)] => ( rw, required, isa => Str );

=attr url

URL (sometimes spelled URI) of the Subversion repository, as an
L<SvnUri|SVN::Simple::Client::Types/SvnUri>.

=cut

has url => ( rw, required, coerce, isa => SvnUri );

=attr working_copy

=cut

has working_copy => ( rw, required, coerce, isa => Dir );

=attr context

Accessor to the underlying L<SVN::Client|SVN::Client> object.
Useful if you want to directly access the methods that are wrapped by this
module.

Uses L</auth_baton> for authentication and L</notify_callback> for event
notification.

=cut

has context => ( ro, required, lazy,
    isa      => 'SVN::Client',
    init_arg => undef,
    default  => sub {
        SVN::Client->new(
            auth   => $ARG[0]->auth_baton,
            notify => $ARG[0]->notify_callback,
        );
    },
);

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
    isa => ArrayRef [Object],
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
    isa      => Str,
    init_arg => undef,
    trigger  => sub {
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

has revision => ( rw, required, isa => Revision, default => 'HEAD' );

=method update_or_checkout

Populates the L</working_copy> directory with the L</revision> version of
the repository at L</url>.  If the working copy is found not to be a directory
then a new checkout is made.

=cut

sub update_or_checkout {
    my $self = shift;

    my $ctx = $self->context;
    my $wc  = $self->working_copy->stringify;
    my ( $e, @out );
    try {
        @out = _svn_try( sub { $ctx->update( $wc, $self->revision, 1 ) } );
    }
    catch(
        SvnError $e where { $ARG->apr_err == $SVN::Error::WC_NOT_DIRECTORY } )
        {
        $e->clear();
            $ctx->checkout( $self->url->as_string, $wc, $self->revision, 1 );
        } catch( SvnError $e ) {
        $e->clear();
            ## no critic (ProhibitCallsToUnexportedSubs)
            SVN::Error::croak_on_error(@out);
        };
    return;
}

# turn off SVN::Client error handling in favor of returning an array where
# the first element might be an error object that can be caught
sub _svn_try {
    my $code_ref = shift;
    my @out;

    {
        local $SVN::Error::handler = undef; ## no critic (ProhibitPackageVars)
        @out = $code_ref->();
    }

    ## no critic (ProhibitCallsToUnexportedSubs)
    croak $out[0] if SVN::Error::is_error( $out[0] );
    return @out;
}

__PACKAGE__->meta->make_immutable;

1;
