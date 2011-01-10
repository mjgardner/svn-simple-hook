## no critic (NamingConventions::Capitalization)
package GSI::Content::Cmd::Command::check_lock;

# ABSTRACT: Subversion pre-commit hook for lock-to-author content

use Carp;
use English '-no_match_vars';
use Moose;
use MooseX::Has::Sugar;
use Readonly;
use Try::Tiny;
use namespace::autoclean;

extends 'MooseX::App::Cmd::Command';
with 'GSI::Automerge::SchemaConnection';
with 'GSI::Content::Config';
with 'SVN::Simple::Hook::PreCommit' => { -version => 0.110100 };

Readonly my $SVN_BRANCH => 'SVN_LTA_SUPPORT';
Readonly my $DEFAULT_LTA_ID => 3;    # default lock status ID for new branches

=method execute

Runs the subcommand.

=cut

sub execute {
    my ( $self, $opt, $args ) = @ARG;

    my $schema = $self->automerge();
    my $repos  = $self->repository();

    try {
        my @COMPONENT_REPO = (
            { component_name => $repos->path() },
            { key            => 'scm_component_uk1' },
        );
        my $guard = $schema->txn_scope_guard();

        my $component_rs = $schema->resultset('ScmComponent');
        my $component    = $component_rs->find(@COMPONENT_REPO);
        if ( !defined $component ) {
            $component = $component_rs->find_or_create(@COMPONENT_REPO);
            $schema->resultset('Branch')->create(
                {   branch_name            => $SVN_BRANCH,
                    component_id           => $component->component_id(),
                    default_lock_status_id => $DEFAULT_LTA_ID,
                }
            ) or croak 'no branch record for ', $repos->path();
        }

        $guard->commit();
    }
    catch {
        croak "database transaction aborted: $EVAL_ERROR";
    };

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
