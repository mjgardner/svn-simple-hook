package GSI::Content::Cmd::Command::check_lock;

# ABSTRACT: Subversion pre-commit hook for lock-to-author content

use Moose;
use MooseX::Has::Sugar;
use namespace::autoclean;

extends 'MooseX::App::Cmd::Command';
with 'GSI::Automerge::SchemaConnection';

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

    content_svn_hook check_lock -r "$REPOS" -t "$TXN" || exit 1
    exit 0
