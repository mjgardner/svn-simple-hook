#!perl

use English '-no_match_vars';
use File::Temp;
use Readonly;
use SVN::Core;
use SVN::Repos;
use Test::More;
use Test::Moose;
use App::Cmd::Tester;

our $CLASS;

BEGIN {
    Readonly our $CLASS => 'GSI::Content::Cmd::Command::check_lock';
    eval "require $CLASS; $CLASS->import();";
}
Readonly my @ROLES => qw(
    SVN::Simple::Hook::PreCommit
    GSI::Automerge::SchemaConnection
);
Readonly my @ATTRS => ('messages');

plan tests => 1 + @ROLES + @ATTRS;
isa_ok( $CLASS, 'MooseX::App::Cmd::Command' );
does_ok( $CLASS, $ARG ) for @ROLES;
has_attribute_ok( $CLASS, $ARG ) for @ATTRS;
