#!perl

use English '-no_match_vars';
use Readonly;
use MooseX::Types::Moose qw(Int Str);
use MooseX::Types::Path::Class qw(Dir File);
use Path::Class;
use Test::More;
use Test::Moose;
use GSI::SRM::Content::Cmd;
use GSI::SRM::Content::Config::Types 'Messages';

Readonly our $CLASS => 'GSI::SRM::Content::Cmd';

Readonly my %CMD => (
    Deploy => { roles => ['SVN::Simple::Client::AsRole'] },
    Check  => {
        roles => ['SVN::Simple::Hook::PreCommit'],
        attrs => {
            svn_branch      => { isa => Str, default => 'SVN_LTA_SUPPORT' },
            default_lock_id => { isa => Int, default => 3 },
            messages_dir => { isa => Dir, default => dir('conf/messages') },
            _messages => { isa => Messages },
            schema    => { isa => 'GSI::Automerge::Connection::Schema' },
        },
    },
    Minify => {
        attrs => {
            working_copy => { isa => Dir },
            ant_target   => { isa => Str, default => 'yuicompress' },
            yuicompressor => {
                isa     => File,
                default => file(
                    '/usr/local/tools/maven_repo/external_free',
                    'yuicompressor/yuicompressor/2.4.2',
                    'yuicompressor-2.4.2.jar',
                ),
            },
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
    can_ok( $cmd_class, 'execute' );
    $tests += 2;

    my @roles = qw(MooseX::SimpleConfig MooseX::Getopt);
    if ( exists $check_ref->{roles} ) {
        push @roles, @{ $check_ref->{roles} };
    }
    does_ok( $cmd_class, $ARG, "$command does $ARG" ) for @roles;
    $tests += @roles;

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
