package GSI::SRM::Content::Cmd;

# ABSTRACT: application class for running content commands

use Moose;
use namespace::autoclean;
extends 'MooseX::App::Cmd';
__PACKAGE__->meta->make_immutable();
1;

__END__

=head1 DESCRIPTION

Command line script used for content locking, deployment and unlocking

=head1 SYNOPSIS

    use GSI::SRM::Content::Cmd;
    GSI::SRM::Content::Cmd->run();
