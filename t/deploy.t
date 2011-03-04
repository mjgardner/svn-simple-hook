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
                '--revision'     => 4675,
                '--url' =>
                    'http://devsvn.gspt.net/svn/partnercontent/tbl/us/trunk',
            ],
        );
    },
    'deploy',
);

is( $result->error, undef, 'threw no exceptions' );

my @svn_dirs;
$TESTDIR->recurse(
    callback => sub {
        return if !$ARG[0]->is_dir or $ARG[0]->dir_list(-1) ne '.svn';
        push @svn_dirs, $ARG[0];
    }
);
$ARG->rmtree() for @svn_dirs;

compare_dirs_filter_ok( dir('t/deploy_expected'),
    $TESTDIR, \&_blank_crlf_filter, 'matched expected targets' );

diag 'cleaning up...';
$TESTDIR->rmtree();

sub _blank_crlf_filter {
    my $line = shift;
    return q{} if $line =~ /\A \s* \z/;
    $line =~ s/ \r\n \z/\n/;
    return $line;
}