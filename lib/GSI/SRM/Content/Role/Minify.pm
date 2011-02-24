package GSI::SRM::Content::Role::Minify;

# ABSTRACT: role for minifying SRM content

use strict;
use Carp;
use English '-no_match_vars';
use IPC::System::Simple qw(capturex runx);
use Moose::Role;
use MooseX::Has::Sugar;
use MooseX::Types::Moose 'Str';
use MooseX::Types::Path::Class qw(Dir File);
use Path::Class;
use Readonly;
use Regexp::DefaultFlags;
## no critic (RequireDotMatchAnything, RequireExtendedFormatting)
## no critic (RequireLineBoundaryMatching)
use TryCatch;
use XML::LibXML;
use namespace::autoclean;

=attr working_copy

Directory containing content to be minified

=cut

has working_copy => ( rw, required, coerce,
    isa           => Dir,
    documentation => 'directory containing content to be minified',
);

=attr ant_target

Name of the Ant target used to run the minify tasks

=cut

has ant_target => ( ro, required,
    isa           => Str,
    default       => 'minify',
    documentation => 'name of the Ant target used to run the minify tasks',
);

=attr yuicompressor

Full path to the yuicompressor JAR file

=cut

has yuicompressor => ( ro, required, coerce,
    isa           => File,
    documentation => 'full path to the yuicompressor JAR file',
    default       => sub {
        file(
            '/usr/local/tools/maven_repo/external_free',
            'yuicompressor/yuicompressor/2.4.2',
            'yuicompressor-2.4.2.jar',
        );
    },
);

=method minify

Looks for Ant build XML files in L</working_copy> and then runs C<ant>
with L</yuicompressor> on them to minify any content they describe.

=cut

sub minify {
    my $self = shift;
    $self->working_copy->recurse(
        callback => $self->_make_ant_finder_callback() );
    return;
}

sub _make_ant_finder_callback {
    my $self   = shift;
    my $target = $self->ant_target;
    ## no critic (RequireInterpolationOfMetachars)
    Readonly my $XPATH => '/project/target/java[@jar="${yuicompressor.jar}"]'
        . qq{/../../target[\@name="$target"]};

    return sub {
        my $path = shift;
        return if $path->is_dir or $path !~ / [.]xml \z/i;
        my @dir_list = $path->dir->dir_list;
        return if 'CVS' ~~ @dir_list or '.svn' ~~ @dir_list;

        # look for matching XML files but only carp if parse error
        my $err;
        try {
            return
                if !XML::LibXML->load_xml( location => "$path" )
                    ->exists($XPATH);
        }
        catch($err) {
            carp $err;
                return;
        };

        runx(
            ant => '-Dyuicompressor.jar=' . _ant_path( $self->yuicompressor ),
            '-f' => _ant_path($path),
            $target,
        );
        return;
    };
}

sub _ant_path {
    my $path = shift;
    return $path if $OSNAME ne 'cygwin';
    $path = capturex( qw(/usr/bin/cygpath --windows), $path );
    chomp $path;
    return $path;
}

1;

__END__

=head1 DESCRIPTION

This role gives L<Moose|Moose> classes the ability to minify CSS and
JavaScript content using the YUI Compressor and Ant.

=head1 SYNOPSIS

    package My::Minifier;
    use Moose;
    with 'GSI::SRM::Content::Role::Minify';
