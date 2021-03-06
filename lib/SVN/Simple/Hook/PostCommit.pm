use utf8;
use Modern::Perl;

package SVN::Simple::Hook::PostCommit;
use strict;

# VERSION
use Any::Moose '::Role';
use Any::Moose 'X::Types::Common::Numeric' => ['PositiveInt'];
use SVN::Core;
use SVN::Repos;
use SVN::Fs;
use namespace::autoclean;
with 'SVN::Simple::Hook';

has revision_number => (
    is            => 'ro',
    isa           => PositiveInt,
    required      => 1,
    traits        => ['Getopt'],
    cmd_aliases   => [qw(rev revnum rev_num revision_number)],
    documentation => 'commit revision number',
);

has _svn_filesystem => (
    is       => 'ro',
    isa      => '_p_svn_fs_t',
    required => 1,
    lazy     => 1,
    default  => sub { shift->repository->fs },
);

sub _build_author {
    my $self = shift;
    return $self->_svn_filesystem->revision_prop( $self->revision_number,
        'svn:author' );
}

sub _build_root {
    my $self = shift;
    return $self->_svn_filesystem->revision_root( $self->revision_number );
}

1;

# ABSTRACT: Role for Subversion post-commit hooks

=head1 DESCRIPTION

This L<Moose|Moose::Role> / L<Mouse|Mouse::Role> role gives you access to the
Subversion revision just committed for use in a post-commit hook.  It's designed
for use with
L<MooseX|MooseX::App::Cmd::Command> /
L<MouseX|MouseX::App::Cmd::Command>::App::Cmd::Command
classes, so consult the main
L<MooseX|MooseX::App::Cmd> / L<MouseX|MouseX::App::Cmd>::App::Cmd documentation
for details on how to extend it to create your scripts.

=head1 SYNOPSIS

    package MyHook::Cmd;
    use Any::Moose;
    extends any_moose('X::App::Cmd');

    package MyHook::Cmd::Command::post_commit;
    use Any::Moose;
    extends any_moose('X::App::Cmd::Command');
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

=attr revision_number

Revision number created by the commit.

=attr author

The author of the current transaction as required by all
L<SVN::Simple::Hook|SVN::Simple::Hook> consumers.

=attr root

The L<Subversion root|SVN::Fs/_p_svn_fs_root_t> node as required by all
L<SVN::Simple::Hook|SVN::Simple::Hook> consumers.
