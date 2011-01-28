#!perl

use English '-no_match_vars';
use Readonly;
use Test::More;
use Test::Moose;

our $CLASS;
Readonly my @ROLE => qw(MooseX::SimpleConfig MooseX::Getopt);
Readonly my %ATTR => (
    configfile => 'database.ini',
    dsn        => 'dbi:Oracle:merasdv',
    username   => 'byronm',
    password   => 'password',
    _schema    => undef,
);

BEGIN {
    Readonly our $CLASS => 'GSI::Automerge::Schema::Configured';
    eval "require $CLASS; $CLASS->import();";
}

does_ok( $CLASS, $ARG ) for @ROLE;
has_attribute_ok( $CLASS, $ARG ) for keys %ATTR;
my $tests = @ROLE + keys %ATTR;

while ( my ( $attr, $default ) = each %ATTR ) {
    next if !defined $default;
    is( $CLASS->meta->find_attribute_by_name($attr)->default(),
        $default, "$attr default" );
    $tests++;
}

my $factory = $CLASS->new_with_options( map { $ARG => $ATTR{$ARG} }
        qw(dsn username password) );
isa_ok( $factory->_schema(), 'GSI::Automerge::Schema', 'schema attribute' );
$tests++;

done_testing($tests);
