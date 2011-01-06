#!perl

use English '-no_match_vars';
use Test::More tests => 1;
use GSI::Content::Cmd;

isa_ok( 'GSI::Content::Cmd', 'MooseX::App::Cmd' );
