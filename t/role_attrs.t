#!perl

use English '-no_match_vars';
use Test::Most;
use Readonly;

Readonly my %ATTR => read_attr_hash(<<'END_DATA');
    SVN::Simple::Client::AsRole  username password url working_copy context
    SVN::Simple::Hook            repos_path
    SVN::Simple::Hook::PreCommit repos_path txn_name transaction author root
END_DATA
Readonly my %ATTR_TODO => read_attr_hash(<<'END_DATA');
    SVN::Simple::Hook::PostCommit        repos_path rev
    SVN::Simple::Hook::PostLock          repos_path user
    SVN::Simple::Hook::PostRevpropChange repos_path rev user propname action
    SVN::Simple::Hook::PostUnlock        repos_path user
    SVN::Simple::Hook::PreLock           repos_path path user
    SVN::Simple::Hook::PreRevpropChange  repos_path rev user propname action
    SVN::Simple::Hook::PreUnlock         repos_path path user
    SVN::Simple::Hook::PreUnlock         repos_path user capabilities
END_DATA

while ( my ( $role, $attr_ref ) = each %ATTR ) {
    role_has_attrs_ok( $role, @{$attr_ref} );
}
while ( my ( $role, $attr_ref ) = each %ATTR_TODO ) {
TODO: { role_has_attrs_ok( $role, @{$attr_ref} ) }
}

done_testing( keys(%ATTR) + keys(%ATTR_TODO) );

sub read_attr_hash {
    return map { $ARG->[0] => [ @{$ARG}[ 1 .. $#{$ARG} ] ] }
        map { [split] } split "\n", shift;
}

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
