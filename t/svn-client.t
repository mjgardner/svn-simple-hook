#!perl

use English '-no_match_vars';
use File::Temp;
use Path::Class;
use Test::Most tests => 5;
use Readonly;
use SVN::Core;
use SVN::Repos;
use SVN::Fs;
use URI::file;

our $CLASS;

BEGIN {
    Readonly our $CLASS => 'SVN::Simple::Client';
    eval "require $CLASS; $CLASS->import();";
}

my $repos_dir = File::Temp->newdir();
my $repos_uri = URI::file->new_abs("$repos_dir");
my $repos     = SVN::Repos::create( "$repos_dir", (undef) x 4 );
my $wc        = File::Temp->newdir();

can_ok( $CLASS, 'update_or_checkout' );
my $svn = new_ok( $CLASS => [ url => "$repos_uri", working_copy => "$wc" ] );

for (qw(checkout update)) {
    my $file_name = 'test' . scalar Test::More->builder->summary();
    _import_file( $file_name, $ARG, $repos_uri );
    lives_and(
        sub {
            $svn->update_or_checkout();
            is( file( $wc, $file_name )->slurp(), $ARG );
        },
        $ARG,
    );
}

$svn->working_copy('/dev/null');
dies_ok( sub { $svn->update_or_checkout() }, 'checkout exception' );

sub _import_file {
    my ( $name, $content, $repos_uri ) = @ARG;

    my $dir  = File::Temp->newdir();
    my $file = file( "$dir", $name );
    my $fh   = $file->openw();
    print $fh $content;
    close $fh;
    $svn->context->import( "$dir", "$repos_uri", 0 );
}
