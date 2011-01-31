#!perl

use English '-no_match_vars';
use Readonly;
use MooseX::Types::Moose qw(Int Str);
use MooseX::Types::Path::Class 'Dir';
use Path::Class;
use Test::More;
use Test::Moose;
use GSI::Content::Cmd;
use GSI::Content::Config::Types 'Messages';

Readonly our $CLASS => 'GSI::Content::Cmd';

Readonly my %CMD => (
    deploy     => { roles => ['SVN::Simple::Client::AsRole'] },
    check_lock => {
        roles => ['SVN::Simple::Hook::PreCommit'],
        attrs => {
            svn_branch      => { isa => Str, default => 'SVN_LTA_SUPPORT' },
            default_lock_id => { isa => Int, default => 3 },
            messages_dir => { isa => Dir, default => dir('conf/messages') },
            _messages => { isa => Messages },
            schema    => { isa => 'GSI::Automerge::Connection::Schema' },
        },
    },
);

isa_ok( $CLASS, 'MooseX::App::Cmd', $CLASS );
my $tests = 1;

while ( my ( $command, $check_ref ) = each %CMD ) {
    my $cmd_class = "${CLASS}::Command::$command";
    eval "require $cmd_class; $cmd_class->import();";
    my $meta = $cmd_class->meta();

    isa_ok( $cmd_class, 'MooseX::App::Cmd::Command', $command );
    $tests++;

    does_ok( $cmd_class, $ARG, "$command does $ARG" )
        for @{ $check_ref->{roles} }, qw(MooseX::SimpleConfig MooseX::Getopt);
    $tests += 2 + @{ $check_ref->{roles} };

    next if !exists $check_ref->{attrs};
    while ( my ( $attr_name, $options_ref ) = each %{ $check_ref->{attrs} } )
    {
        has_attribute_ok( $cmd_class, $attr_name, "$command has $attr_name" );
        my $attr = $meta->find_attribute_by_name($attr_name);
        ok( $attr->type_constraint->equals( $options_ref->{isa} ),
            "$attr_name isa $options_ref->{isa}" );
        $tests += 2;

        if ( !$attr->is_default_a_coderef() ) {
            is( $attr->default(),
                $options_ref->{default},
                "$attr_name default"
            );
            $tests++;
        }
    }

    for ( grep { $ARG->does('Getopt') } $meta->get_all_attributes() ) {
        ok( $ARG->has_documentation(), $ARG->name() . ' has documentation' );
        $tests++;
    }
}

done_testing($tests);
