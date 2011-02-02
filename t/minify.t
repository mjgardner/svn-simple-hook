#!perl

use Test::Most tests => 3;
use App::Cmd::Tester;
use Test::Files;
use Path::Class;
use Readonly;

our $CLASS;

BEGIN {
    Readonly our $CLASS => 'GSI::Content::Cmd';
    eval "require $CLASS; $CLASS->import();";
}

Readonly my $WC => dir( 't', 'minify_files' );
my $result;
lives_ok(
    sub { $result = test_app( $CLASS => [ qw(minify --working_copy), $WC ] ) }
    ,
    'run command'
);
is( $result->error(), undef, 'threw no exceptions' );
compare_dirs_ok( $WC->subdir('target_expected'),
    $WC->subdir('target'), 'matched expected targets' );
$WC->subdir('target')->rmtree();
