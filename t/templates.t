#!perl

package My::Class;
use Moose;
with 'GSI::Content::Config';

package main;
use English '-no_match_vars';
use Test::More;

my @MESSAGE_TYPES = qw(contact lock author warning);
plan tests => scalar @MESSAGE_TYPES;

my $class = My::Class->new();
for (@MESSAGE_TYPES) {
    isnt( $class->message($ARG)->fill_in(), q{}, "$ARG template" );
    diag( $class->message($ARG)->fill_in() );
}
