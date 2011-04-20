package SVN::Simple::Hook::PreCommit;

# ABSTRACT: Role for Subversion pre-commit hooks

use strict;
use English '-no_match_vars';
use Moose::Role;
use MooseX::Has::Sugar;
use MooseX::Types::Moose 'Str';
use SVN::Core;
use SVN::Repos;
use SVN::Fs;
use namespace::autoclean;
with 'SVN::Simple::Hook';

=attr txn_name

Full name of the transaction to check in the repository.

=cut

has txn_name => (
    ro,
    traits        => ['Getopt'],
    isa           => Str,
    cmd_aliases   => [qw(t txn tran trans transaction transaction_name)],
    documentation => 'commit transaction name',
);

=pod

=attr transaction

The current L<Subversion transaction|SVN::Fs/_p_svn_fs_txn_t>, automatically
populated at object creation time when the L<txn_name|/txn_name> is set.

=cut

has transaction => (
    ro, required, lazy,
    isa      => '_p_svn_fs_txn_t',
    init_arg => undef,
    default => sub { $ARG[0]->repository->fs->open_txn( $ARG[0]->txn_name ) },
);

=attr author

The author of the current transaction as required by all
L<SVN::Simple::Hook|SVN::Simple::Hook> consumers.

=attr root

The L<Subversion root|SVN::Fs/_p_svn_fs_root_t> node as required by all
L<SVN::Simple::Hook|SVN::Simple::Hook> consumers.

=cut

{
    ## no critic (Subroutines::ProhibitUnusedPrivateSubroutines)
    sub _build_author { return shift->transaction->prop('svn:author') }
    sub _build_root   { return shift->transaction->root() }
}

1;

__END__

=head1 DESCRIPTION

This L<Moose::Role|Moose::Role> gives you access to the current Subversion
transaction for use in a pre-commit hook.  It's designed for use with
L<MooseX::App::Cmd::Command|MooseX::App::Cmd::Command> classes, so consult
the main L<MooseX::App::Cmd documentation|MooseX::App::Cmd> for details
on how to extend it to create your scripts.

=head1 SYNOPSIS

    package MyHook::Cmd;
    use Moose;
    extends 'MooseX::App::Cmd';

    package MyHook::Cmd::Command::pre_commit;
    use Moose;
    extends 'MooseX::App::Cmd::Command';
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
