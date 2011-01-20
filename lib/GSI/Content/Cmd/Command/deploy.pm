## no critic (NamingConventions::Capitalization)
package GSI::Content::Cmd::Command::deploy;

# ABSTRACT: deploy content from Subversion and post-process it

use Carp;
use English '-no_match_vars';
use Moose;
use MooseX::Has::Sugar;
use MooseX::Types::URI 'Uri';
use Readonly;
use SVN::Simple::Client;
use SVN::Simple::Client::Types 'SvnUri';
use TryCatch;
use namespace::autoclean;
extends 'MooseX::App::Cmd::Command';
with 'MooseX::SimpleConfig';
with 'MooseX::Getopt';

has '+configfile' => ( default => 'conf/config.ini' );

for (qw(MooseX::Types::URI::Uri SVN::Simple::Client::Types::SvnUri)) {
    MooseX::Getopt::OptionTypeMap->add_option_type_to_map( $ARG => '=s' );
}

Readonly my @CLIENT_ATTRS => qw(username password url working_copy);

for (@CLIENT_ATTRS) {
    my $attr = SVN::Simple::Client->meta->get_attribute($ARG);
    has $ARG => ( ro, required,
        isa           => $attr->type_constraint,
        coerce        => $attr->should_coerce,
        documentation => "$attr for SVN::Simple::Client",
    );
}

has _svn => ( ro, required, lazy,
    isa     => 'SVN::Simple::Client',
    default => sub {
        SVN::Simple::Client->new( map { $ARG => shift->$ARG } @CLIENT_ATTRS );
    },
);

=method execute

Runs the subcommand.

=cut

sub execute {
    my ( $self, $opt, $args ) = @ARG;

    $self->_svn->update_or_checkout();

    return;
}

__PACKAGE__->meta->make_immutable;

1;

__END__

=head1 DESCRIPTION

=head1 SYNOPSIS

=for test_synopsis 1;

=for test_synopsis __END__

    perl -MGSI::Content::Cmd -e 'GSI::Content::Cmd->run()' deploy \
        --working_copy /path/to/dir
        --svn_url http://sample.com/svn/repo/trunk
