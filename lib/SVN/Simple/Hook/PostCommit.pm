package SVN::Simple::Hook::PostCommit;

# ABSTRACT: Role for Subversion post-commit hooks

use strict;
use English '-no_match_vars';
use Moose::Role;
use MooseX::Has::Sugar;
use MooseX::Types::Common::Numeric 'PositiveInt';
use SVN::Core;
use SVN::Repos;
use SVN::Fs;
use namespace::autoclean;
with 'SVN::Simple::Hook';

=attr revision_number

Revision number created by the commit.

=cut

has revision_number => (
    ro,
    traits        => ['Getopt'],
    isa           => PositiveInt,
    cmd_aliases   => [qw(rev revnum rev_num revision_number)],
    documentation => 'commit transaction name',
);

=attr author

The author of the current transaction as required by all
L<SVN::Simple::Hook|SVN::Simple::Hook> consumers.

=attr root

The L<Subversion root|SVN::Fs/_p_svn_fs_root_t> node as required by all
L<SVN::Simple::Hook|SVN::Simple::Hook> consumers.

=cut

has _svn_filesystem => (
    ro, lazy,
    isa     => '_p_svn_fs_t',
    default => sub { shift->repository->fs },
);

{
    ## no critic (Subroutines::ProhibitUnusedPrivateSubroutines)
    sub _build_author {
        my $self = shift;
        return $self->_svn_filesystem->revision_prop( $self->revision_number,
            'svn:author' );
    }

    sub _build_root {
        my $self = shift;
        return $self->_svn_filesystem->revision_root(
            $self->revision_number );
    }
}

1;

__END__

=head1 DESCRIPTION

This L<Moose::Role|Moose::Role> gives you access to the Subversion revision
just committed for use in a post-commit hook.  It's designed for use with
L<MooseX::App::Cmd::Command|MooseX::App::Cmd::Command> classes, so consult
the main L<MooseX::App::Cmd documentation|MooseX::App::Cmd> for details
on how to extend it to create your scripts.

=head1 SYNOPSIS

    package MyHook::Cmd;
    use Moose;
    extends 'MooseX::App::Cmd';

    package MyHook::Cmd::Command::post_commit;
    use Moose;
    extends 'MooseX::App::Cmd::Command';
    with 'SVN::Simple::Hook::PostCommit';

    sub execute {
        my ( $self, $opt, $args ) = @_;

        warn $self->author, ' changed ',
            scalar keys %{ $self->root->paths_changed() }, " paths\n";

        return;
    }

=head1 Example F<hooks/post-commit> hook script

    #!/bin/sh

    REPOS="$1"
    REV="$2"

    perl -MMyHook::Cmd -e 'MyHook::Cmd->run()' post_commit -r "$REPOS" --rev "$REV" || exit 1
    exit 0
