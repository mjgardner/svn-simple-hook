## no critic (NamingConventions::Capitalization)
package GSI::Content::Cmd::Command::minify;

# ABSTRACT: minify a working copy using its Ant scripts

use English '-no_match_vars';
use IPC::System::Simple 'runx';
use Moose;
use MooseX::Has::Sugar;
use MooseX::Types::Moose 'Str';
use MooseX::Types::Path::Class qw(Dir File);
use Path::Class;
use Regexp::DefaultFlags;
## no critic (RequireDotMatchAnything, RequireExtendedFormatting)
## no critic (RequireLineBoundaryMatching)
use XML::LibXML;
use namespace::autoclean;
extends 'MooseX::App::Cmd::Command';
with 'MooseX::SimpleConfig';
with 'MooseX::Getopt';

has '+configfile' => ( default => 'conf/config.ini' );

=attr working_copy

=cut

has working_copy => ( rw, required, coerce,
    isa           => Dir,
    documentation => 'directory containing content to be minified',
);

=attr ant_target

=cut

has ant_target => ( ro, required,
    isa           => Str,
    default       => 'minify',
    documentation => 'name of the ant target used to run the minify tasks',
);

=attr yuicompressor

=cut

has yuicompressor => ( ro, required, coerce,
    isa     => File,
    default => sub {
        file(
            '/usr/local/tools/maven_repo/external_free/yuicompressor/yuicompressor/2.4.2/yuicompressor-2.4.2.jar'
        );
    },
    documentation => 'full path to the yuicompressor JAR',
);

=method execute

Runs the subcommand.

=cut

sub execute {
    my ( $self, $opt, $args ) = @ARG;
    $self->working_copy->recurse(
        callback => $self->_make_ant_finder_callback() );
    return;
}

sub _make_ant_finder_callback {
    my $self   = shift;
    my $target = $self->ant_target();
    return sub {
        my $path = shift;
        return if $path->is_dir() or $path !~ / [.]xml \z/i;
        my @dir_list = $path->dir->dir_list();
        return if 'CVS' ~~ @dir_list or '.svn' ~~ @dir_list;
        return
            if !XML::LibXML->load_xml( location => "$path" )
            ->exists( '/project/target/java[@jar="${yuicompressor.jar}"]'
                . '/../../target[@name="'
                . $target
                . '"]' );

        runx(
            ant => '-Dyuicompressor.jar=' . $self->yuicompressor(),
            -f  => "$path",
            $target,
        );
        return;
    };
}

__PACKAGE__->meta->make_immutable();

1;

__END__

=head1 DESCRIPTION

=head1 SYNOPSIS

=for test_synopsis 1;

=for test_synopsis __END__

    perl -MGSI::Content::Cmd -e 'GSI::Content::Cmd->run()' minify \
        --working_copy /path/to/dir
