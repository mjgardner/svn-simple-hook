#!perl

use Readonly;
Readonly my $ROLE => 'GSI::Content::Config';

package My::Class;
use Moose;
with $ROLE;

package main;
use English '-no_match_vars';
use Test::Most;

Readonly my %TYPE_OF_ATTR =>
    ( messages => 'GSI::Content::Config::Types::Messages' );

my $tests = 1;
role_has_attrs_ok( $ROLE, keys %TYPE_OF_ATTR );

my $class = My::Class->new();
while ( my ( $attr, $type ) = each %TYPE_OF_ATTR ) {
    $tests++;
    ok( $class->meta->get_attribute($attr)->type_constraint->equals($type),
        "attribute $attr is a $type" );
}

done_testing($tests);

sub role_has_attrs_ok {
    my ( $role, @attrs ) = @ARG;

    eval "require $role; $role->import();";
    todo_skip "$role not implemented for attributes: @attrs", 1
        if $EVAL_ERROR;
    return cmp_deeply(
        [ $role->meta->get_attribute_list() ],
        supersetof(@attrs), "$role has attributes: @attrs",
    );
}
