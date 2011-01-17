#!perl

package main;
use English '-no_match_vars';
use Readonly;
use MooseX::Types::Moose qw(Int Str);
use MooseX::Types::Path::Class 'Dir';
use Test::Most;
use Test::Moose;
use GSI::Content::Config::Types 'Messages';

my @MESSAGE_TYPES = qw(contact lock author warning);
Readonly my %TYPE_OF_ATTR => (
    _messages       => Messages,
    svn_branch      => Str,
    default_lock_id => Int,
    messages_dir    => Dir,
);

our $CLASS;

BEGIN {
    Readonly our $CLASS => 'GSI::Content::Config';
    eval "require $CLASS; $CLASS->import();";
}

plan tests => @MESSAGE_TYPES + 1 + 2 * keys %TYPE_OF_ATTR;

while ( my ( $attr, $type ) = each %TYPE_OF_ATTR ) {
    has_attribute_ok( $CLASS, $attr );
    ok( $CLASS->meta->find_attribute_by_name($attr)
            ->type_constraint->equals($type),
        "attribute $attr is a $type"
    );
}
my $config = new_ok($CLASS);

for (@MESSAGE_TYPES) {
    isnt( $config->message($ARG)->fill_in(), q{}, "$ARG template" );

    #    diag( $config->message($ARG)->fill_in() );
}
