use utf8;
use Modern::Perl;

package SVN::Simple::Hook::PreCommit;
use strict;

# VERSION
use Any::Moose '::Role';
use Any::Moose 'X::Types::' . any_moose() => ['Str'];
use SVN::Core;
use SVN::Repos;
use SVN::Fs;
use namespace::autoclean;
with 'SVN::Simple::Hook';

has txn_name => (
    is            => 'ro',
    isa           => Str,
    required      => 1,
    traits        => ['Getopt'],
    cmd_aliases   => [qw(t txn tran trans transaction transaction_name)],
    documentation => 'commit transaction name',
);

has transaction => (
    is       => 'ro',
    isa      => '_p_svn_fs_txn_t',
    required => 1,
    lazy     => 1,
    init_arg => undef,
    default  => sub { $_[0]->repository->fs->open_txn( $_[0]->txn_name ) },
);

sub _build_author { return shift->transaction->prop('svn:author') }
sub _build_root   { return shift->transaction->root() }

1;

# ABSTRACT: Role for Subversion pre-commit hooks

=head1 DESCRIPTION

This L<Moose|Moose::Role> / L<Mouse|Mouse::Role> role gives you access to the
current Subversion transaction for use in a pre-commit hook.  It's designed
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

    package MyHook::Cmd::Command::pre_commit;
    use Any::Moose;
    extends any_moose('X::App::Cmd::Command');
    with 'SVN::Simple::Hook::PreCommit';

    sub execute {
        my ( $self, $opt, $args ) = @_;
        my $txn = $self->txn();

        warn $self->author, ' changed ',
            scalar keys %{ $self->root->paths_changed() }, " paths\n";

        return;
    }

=head1 Example F<hooks/pre-commit> hook script

    #!/bin/sh

    REPOS="$1"
    TXN="$2"

    perl -MMyHook::Cmd -e 'MyHook::Cmd->run()' pre_commit -r "$REPOS" -t "$TXN" || exit 1
    exit 0

=attr txn_name

Full name of the transaction to check in the repository.

=attr transaction

The current L<Subversion transaction|SVN::Fs/_p_svn_fs_txn_t>, automatically
populated at object creation time when the L<txn_name|/txn_name> is set.

=attr author

The author of the current transaction as required by all
L<SVN::Simple::Hook|SVN::Simple::Hook> consumers.

=attr root

The L<Subversion root|SVN::Fs/_p_svn_fs_root_t> node as required by all
L<SVN::Simple::Hook|SVN::Simple::Hook> consumers.
