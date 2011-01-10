#!perl

use Readonly;
Readonly my $ROLE => 'GSI::Content::Config';

package My::Class;
use Moose;
with $ROLE;

package main;
use English '-no_match_vars';
use Readonly;
use Test::Most;

my @MESSAGE_TYPES = qw(contact lock author warning);
plan tests => scalar @MESSAGE_TYPES;

my $class = My::Class->new();
for (@MESSAGE_TYPES) {
    isnt( $class->message($ARG)->fill_in(), q{}, "$ARG template" );
    diag( $class->message($ARG)->fill_in() );
}
