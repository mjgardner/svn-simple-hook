#!perl

use Test::More tests => 2;
use GSI::Automerge::Schema;

my $schema = GSI::Automerge::Schema->connect();
isa_ok( $schema, 'GSI::Automerge::Schema', 'schema' );
my @sources = $schema->sources();
ok( scalar @sources, 'schema has sources' );
explain \@sources;
