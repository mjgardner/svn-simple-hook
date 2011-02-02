package GSI::Content::Cmd::Command::Check;

# ABSTRACT: SVN pre-commit hook for LTA content

use Carp;
use English '-no_match_vars';
use Moose;
use MooseX::Has::Sugar;
use MooseX::Types::Moose qw(Int Str);
use MooseX::Types::Path::Class 'Dir';
use Path::Class;
use Readonly;
use TryCatch;
use GSI::Automerge::Connection::Schema;
use GSI::Content::Config::Template;
use GSI::Content::Config::Types 'Messages';
use namespace::autoclean;
extends 'MooseX::App::Cmd::Command';
with 'SVN::Simple::Hook::PreCommit';
with 'MooseX::SimpleConfig';
with 'MooseX::Getopt';

has '+configfile' => ( default => 'conf/config.ini' );

has svn_branch => (
    ro, required,
    isa           => Str,
    traits        => ['Getopt'],
    default       => 'SVN_LTA_SUPPORT',
    documentation => 'Branch name to associate with Subversion locked files',
);

has default_lock_id => (
    ro, required,
    isa           => Int,
    traits        => ['Getopt'],
    default       => 3,
    documentation => 'Default lock status ID for new branches',
);

has messages_dir => (
    ro, required, coerce,
    isa           => Dir,
    traits        => ['Getopt'],
    default       => sub { dir('conf/messages') },
    documentation => 'Directory containing error message templates',
);

has _messages => (
    rw, required, lazy_build,
    isa     => Messages,
    traits  => ['Hash'],
    handles => { message => 'accessor' },
);

sub _build__messages {    ## no critic (ProhibitUnusedPrivateSubroutines)
    return { map { $ARG => $ARG[0]->_make_template($ARG) }
            @GSI::Content::Config::Types::MESSAGE_TYPES };
}

sub _make_template {
    my ( $self, $template ) = @ARG;
    return GSI::Content::Config::Template->new(
        TYPE => 'FILE',
        SOURCE =>
            file( $self->messages_dir(), "$template.tmpl" )->stringify(),
    );
}

has schema => ( ro, required, lazy,
    isa     => 'GSI::Automerge::Connection::Schema',
    default => sub {
        GSI::Automerge::Connection::Schema->new_with_config(
            configfile => $ARG[0]->configfile() );
    },
);

has _component => ( ro, lazy_build, isa => 'DBIx::Class::Row' );

sub _build__component {    ## no critic (ProhibitUnusedPrivateSubroutines)
    my $self   = shift;
    my $path   = $self->repository->path();
    my $schema = $self->schema();
    my $rs     = $schema->resultset('ScmComponent');
    my $component;

    try {
        my $guard = $schema->txn_scope_guard();
        my @COMPONENT_REPO
            = ( { component_name => $path }, { key => 'scm_component_uk1' } );

        $component = $rs->find(@COMPONENT_REPO);
        if ( !defined $component ) {
            $component = $rs->find_or_create(@COMPONENT_REPO);
            $schema->resultset('Branch')->create(
                {   branch_name            => $self->svn_branch(),
                    component_id           => $component->component_id(),
                    default_lock_status_id => $self->default_lock_id(),
                }
            ) or croak "no branch record for $path";
        }

        $guard->commit();
    }
    catch { croak "database transaction aborted: $EVAL_ERROR" };

    return $component;
}

=method execute

Runs the subcommand.

=cut

sub execute {
    my ( $self, $opt, $args ) = @ARG;

    my %change_info = %{ $self->root->paths_changed() };
    my $branch      = $self->automerge->resultset('Branch')->search(
        {   component_id => $self->component->component_id(),
            branch_name  => $self->svn_branch(),
        },
    );

    return;
}

__PACKAGE__->meta->make_immutable();

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

    perl -MGSI::Content::Cmd -e 'GSI::Content::Cmd->run()' \
        check_lock -r "$REPOS" -t "$TXN" || exit 1
    exit 0
