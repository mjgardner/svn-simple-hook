#!perl

# PODNAME: quick_minify
# ABSTRACT: run an Ant minify task using yuicompressor

use Modern::Perl;
use IPC::System::Simple 'runx';
use Path::Class;
use Readonly;
use Regexp::DefaultFlags;
use XML::LibXML;

Readonly my $YUICOMPRESSOR =>
    '/usr/local/tools/maven_repo/external_free/yuicompressor/yuicompressor/2.4.2/yuicompressor-2.4.2.jar';

dir->recurse( callback => \&ant_finder_callback );

sub ant_finder_callback {
    my $path = shift;
    return if $path->is_dir() or $path !~ / [.]xml \z/i;
    my @dir_list = $path->dir->dir_list();
    return if 'CVS' ~~ @dir_list or '.svn' ~~ @dir_list;
    return
        if !XML::LibXML->load_xml( location => "$path" )
        ->exists( '/project/target/java[contains(@jar,"yuicompressor")]'
            . '/../../target[@name="minify"]' );
    runx(
        ant => "-Dyuicompressor.jar=$YUICOMPRESSOR",
        -f  => "$path",
        'minify',
    );
}
