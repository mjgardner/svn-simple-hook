#!perl

use English '-no_match_vars';
use Test::Most tests => 3;
use App::Cmd::Tester;
use Test::Files;
use Path::Class;
use Regexp::DefaultFlags;
use Readonly;

use GSI::SRM::Content::Cmd;

Readonly my $TESTDIR => dir('t/deploy_files');

diag 'WARNING: This test requires a network connection to devsvn.gspt.net.';

diag 'deploying, this may take a while...';
my $result;
lives_ok(
    sub {
        $result = test_app(
            'GSI::SRM::Content::Cmd' => [
                'deploy',
                '--working_copy' => $TESTDIR,
                '--revision'     => 2124,
                '--url' =>
                    'http://devsvn.gspt.net/svn/partnerwebstores/peac/gb/trunk',
                '--buildfile_url' =>
                    'http://devsvn.gspt.net/svn/partnerwebstores/peac/gb/trunk/webstore-war/yui-build.xml',
            ],
        );
    },
    'deploy',
);

is( $result->error, undef, 'threw no exceptions' );

compare_dirs_filter_ok(
    $TESTDIR->parent->subdir('target_expected'),
    $TESTDIR->subdir('webstore-war/target'),
    \&_blank_crlf_filter, 'matched expected targets',
);

diag 'cleaning up...';
$TESTDIR->rmtree();

sub _blank_crlf_filter {
    my $line = shift;
    return q{} if $line =~ /\A \s* \z/;
    $line =~ s/ \r\n \z/\n/;
    return $line;
}
