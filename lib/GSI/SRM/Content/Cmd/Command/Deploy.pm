package GSI::SRM::Content::Cmd::Command::Deploy;

# ABSTRACT: deploy and post-process content from SVN

use English '-no_match_vars';
use Moose;
use MooseX::Has::Sugar;
use MooseX::Types::URI 'Uri';
use SVN::Simple::Client;
use SVN::Simple::Client::Types 'SvnUri';
use GSI::SRM::Content::Cmd::Command::Minify;
use namespace::autoclean;
extends 'MooseX::App::Cmd::Command';
with 'MooseX::SimpleConfig';
with 'MooseX::Getopt';
with 'SVN::Simple::Client::AsRole';

has '+logger' => ( traits => ['NoGetopt'] );

has '+configfile' => (
    default       => 'conf/config.ini',
    documentation => 'INI configuration file to set options',
);

for (qw(MooseX::Types::URI::Uri SVN::Simple::Client::Types::SvnUri)) {
    MooseX::Getopt::OptionTypeMap->add_option_type_to_map( $ARG => '=s' );
}

=method execute

Runs the subcommand.

=cut

sub execute {
    my ( $self, $opt, $args ) = @ARG;

    $self->update_or_checkout();

    my $minifier = GSI::SRM::Content::Cmd::Command::Minify->new_with_config(
        map { $ARG => $self->$ARG } qw(app configfile working_copy) );

    $minifier->execute( $opt, $args );
    return;
}

__PACKAGE__->meta->make_immutable();

1;

__END__

=head1 DESCRIPTION

=head1 SYNOPSIS

=for test_synopsis 1;

=for test_synopsis __END__

    perl -MGSI::SRM::Content::Cmd -e 'GSI::SRM::Content::Cmd->run()' deploy \
        --working_copy /path/to/dir
        --url http://sample.com/svn/repo/trunk
