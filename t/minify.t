#!perl

use Test::Most tests => 3;
use App::Cmd::Tester;
use Test::Files;
use Path::Class;
use Regexp::DefaultFlags;
use Readonly;

use GSI::SRM::Content::Cmd;

Readonly my $WC => dir('t/minify_files');
my $result;

diag 'minifying, this may take a while...';
lives_ok(
    sub {
        $result = test_app(
            'GSI::SRM::Content::Cmd' => [ qw(minify --working_copy), $WC ] );
    },
    'minify',
);
is( $result->error, undef, 'threw no exceptions' );

compare_dirs_filter_ok(
    $WC->parent->subdir('target_expected'), $WC->subdir('target'),
    \&_blank_crlf_filter,                   'matched expected targets',
);

diag 'cleaning up...';
$WC->subdir('target')->rmtree();

sub _blank_crlf_filter {
    my $line = shift;
    return q{} if $line =~ /\A \s* \z/;
    $line =~ s/ \r\n \z/\n/;
    return $line;
}
