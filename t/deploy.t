#!perl

use Test::Most tests => 3;
use App::Cmd::Tester;
use Test::Files;
use Path::Class;
use Readonly;

our $CLASS;

BEGIN {
    Readonly our $CLASS => 'GSI::SRM::Content::Cmd';
    eval "require $CLASS; $CLASS->import();";
}

Readonly my $TESTDIR => dir('t/deploy_files');
my $result;
lives_ok(
    sub {
        $result = test_app(
            $CLASS => [
                'deploy',
                '--working_copy' => $TESTDIR,
                '--revision'     => 2124,
                '--url' =>
                    'http://devsvn.gspt.net/svn/partnerwebstores/peac/gb/trunk',
            ],
        );
    },
    'deploy'
);
is( $result->error(), undef, 'threw no exceptions' );
compare_dirs_ok(
    $TESTDIR->parent->subdir('target_expected'),
    $TESTDIR->subdir('webstore-war/target'),
    'matched expected targets'
);
$TESTDIR->rmtree();
