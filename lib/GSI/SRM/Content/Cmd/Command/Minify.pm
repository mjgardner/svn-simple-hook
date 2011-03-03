package GSI::SRM::Content::Cmd::Command::Minify;

# ABSTRACT: minify a working copy using its Ant scripts

use English '-no_match_vars';
use Moose;
use namespace::autoclean;
extends 'MooseX::App::Cmd::Command';
with 'MooseX::Getopt';
with 'GSI::SRM::Content::Role::Configurable';
with 'GSI::SRM::Content::Role::Minify';

=method execute

Runs the subcommand.

=cut

sub execute { $ARG[0]->minify(); print $ARG[0]->output; return }

__PACKAGE__->meta->make_immutable();
1;

__END__

=head1 DESCRIPTION

Command to minify a directory using
L<GSI::SRM::Content::Role::Minify|GSI::SRM::Content::Role::Minify>.

=head1 SYNOPSIS

=for test_synopsis 1;

=for test_synopsis __END__

    perl -MGSI::SRM::Content::Cmd -e 'GSI::SRM::Content::Cmd->run()' minify \
        --working_copy /path/to/dir
