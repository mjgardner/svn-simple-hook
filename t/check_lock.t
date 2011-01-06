#!perl

use English '-no_match_vars';
use Test::More tests => 2;
use Test::Moose;
use GSI::Content::Cmd::Command::check_lock;

isa_ok( 'GSI::Content::Cmd::Command::check_lock',
    'MooseX::App::Cmd::Command' );
does_ok(
    'GSI::Content::Cmd::Command::check_lock',
    'GSI::Automerge::SchemaConnection',
);
