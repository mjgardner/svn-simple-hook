## no critic (NamingConventions::Capitalization)
package GSI::Content::Cmd::Command::check_lock;

# ABSTRACT: Subversion pre-commit hook for lock-to-author content

use English '-no_match_vars';
use Moose;
use MooseX::Has::Sugar;
use GSI::Content::Cmd::Command::check_lock::Types 'LockMessages';
use namespace::autoclean;

extends 'MooseX::App::Cmd::Command';
with 'GSI::Automerge::SchemaConnection';
with 'SVN::Simple::Hook::PreCommit';

has messages => (
    rw,
    isa     => LockMessages,
    default => sub {
        GSI::Content::Cmd::Command::check_lock::Types::make_default();
    },
);

=method execute

Runs the subcommand.

=cut

sub execute {
    my ( $self, $opt, $args ) = @ARG;

    return;
}

__PACKAGE__->meta->make_immutable;

1;

__END__

=head1 DESCRIPTION

Pre-commit hook that checks a Subversion commit against a database of authors
who have certain files locked in their name.

=head1 SYNOPSIS

=for test_synopsis 1;

=for test_synopsis __END__

In your repository's F<hooks/pre-commit> file:

    #!/bin/sh

    REPOS="$1"
    TXN="$2"
    ORACLE_HOME=/usr/app/oracle
    export ORACLE_HOME

    perl -MGSI::Content::Cmd -e 'GSI::Content::Cmd->run()' check_lock -r "$REPOS" -t "$TXN" || exit 1
    exit 0
