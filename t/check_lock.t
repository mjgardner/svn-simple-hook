#!perl

use English '-no_match_vars';
use File::Temp;
use MooseX::Types::Moose qw(Int Str);
use MooseX::Types::Path::Class 'Dir';
use Path::Class;
use Readonly;
use Test::More;
use Test::Moose;
use App::Cmd::Tester;
use GSI::Content::Config::Types 'Messages';

our $CLASS;

BEGIN {
    Readonly our $CLASS => 'GSI::Content::Cmd::Command::check_lock';
    eval "require $CLASS; $CLASS->import();";
}
Readonly my %ATTR => (
    svn_branch      => { isa => Str, default => 'SVN_LTA_SUPPORT' },
    default_lock_id => { isa => Int, default => 3 },
    messages_dir    => { isa => Dir, default => dir('conf/messages') },
    _messages       => { isa => Messages },
    schema => { isa => 'GSI::Automerge::Connection::Schema' },
);
Readonly my @CMD_ATTRS => qw(svn_branch default_lock_id messages_dir);
Readonly my @ROLES     => qw(
    SVN::Simple::Hook::PreCommit
    MooseX::SimpleConfig
    MooseX::Getopt
);

isa_ok( $CLASS, 'MooseX::App::Cmd::Command' );
my $tests = 1;

does_ok( $CLASS, $ARG ) for @ROLES;
$tests += @ROLES;

while ( my ( $attr_name, $options_ref ) = each %ATTR ) {
    has_attribute_ok( $CLASS, $attr_name );
    my $attr = $CLASS->meta->find_attribute_by_name($attr_name);
    ok( $attr->type_constraint->equals( $options_ref->{isa} ),
        "$attr_name isa $options_ref->{isa}" );
    $tests += 2;

    if ( !$attr->is_default_a_coderef() ) {
        is( $attr->default(), $options_ref->{default}, "$attr_name default" );
        $tests++;
    }
}

for ( grep { $ARG->does('Getopt') } $CLASS->meta->get_all_attributes() ) {
    ok( $ARG->has_documentation(), $ARG->name() . ' has documentation' );
    $tests++;
}

done_testing($tests);
