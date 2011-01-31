#!perl

use File::Temp;
use Test::More tests => 2;
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
my $repos     = SVN::Repos::create( "$repos_dir", (undef) x 4 );
my $wc        = File::Temp->newdir();

can_ok( $CLASS, 'update_or_checkout' );
my $svn = new_ok( $CLASS =>
        [ url => URI::file->new_abs("$repos_dir"), working_copy => "$wc" ] );
