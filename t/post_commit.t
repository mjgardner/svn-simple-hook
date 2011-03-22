#!perl

package My::Cmd;
use Moose;
extends 'MooseX::App::Cmd';

package My::Cmd::Command::post_commit;
use English '-no_match_vars';
use Moose;
extends 'MooseX::App::Cmd::Command';
with 'SVN::Simple::Hook::PostCommit';

sub execute {
    my ( $self, $opt, $args ) = @ARG;

    warn $self->author(), ' changed ',
        scalar keys %{ $self->root->paths_changed() }, " paths\n";

    return;
}

package main;
use English '-no_match_vars';
use File::Temp;
use Readonly;
use SVN::Core;
use SVN::Repos;
use Test::More tests => 2;
use App::Cmd::Tester;

Readonly my $USERID => scalar getpwuid $EFFECTIVE_USER_ID;
my $tmp_dir = File::Temp->newdir();
my $repos   = SVN::Repos::create( "$tmp_dir", (undef) x 4 );
my $txn     = $repos->fs_begin_txn_for_update( 0, "$USERID" );
$txn->root->make_file('/foo');
my $rev = $repos->fs_commit_txn($txn);

my $result = test_app(
    'My::Cmd' => [
        'post_commit',
        '-r'    => "$tmp_dir",
        '--rev' => $rev,
    ],
);

is( $result->exit_code(), 0, 'successful run' );
isnt( $result->output, q{}, 'got output' );