## no critic (NamingConventions::Capitalization)
package GSI::Content::Cmd::Command::deploy;

# ABSTRACT: deploy and post-process content from SVN

use English '-no_match_vars';
use Moose;
use MooseX::Has::Sugar;
use MooseX::Types::Moose qw(ArrayRef HashRef);
use MooseX::Types::URI 'Uri';
use Readonly;
use Regexp::DefaultFlags;
## no critic (RequireDotMatchAnything, RequireExtendedFormatting)
## no critic (RequireLineBoundaryMatching)
use SVN::Simple::Client;
use SVN::Simple::Client::Types 'SvnUri';
use TryCatch;
use XML::Twig;
use namespace::autoclean;
extends 'MooseX::App::Cmd::Command';
with 'MooseX::SimpleConfig';
with 'MooseX::Getopt';
with 'SVN::Simple::Client::AsRole';

has '+configfile' => ( default => 'conf/config.ini' );

for (qw(MooseX::Types::URI::Uri SVN::Simple::Client::Types::SvnUri)) {
    MooseX::Getopt::OptionTypeMap->add_option_type_to_map( $ARG => '=s' );
}

has bundles => ( rw, isa => HashRef [ArrayRef] );

has _twig => ( ro, lazy_build, isa => 'XML::Twig', init_arg => undef );

sub _build__twig {    ## no critic (ProhibitUnusedPrivateSubroutines)
    my $self = shift;

    return XML::Twig->new(
        twig_handlers => {
            ## no critic (RequireInterpolationOfMetachars)
            '/project/filelist/file[@name]' => sub {
                push @{ $self->bundles->{ $ARG->parent->att('id') } },
                    $ARG->att('name');
                return;
            },
            '/target/concat/filelist[@refid]' => sub { return; },
        }
    );
}

=method execute

Runs the subcommand.

=cut

sub execute {
    my ( $self, $opt, $args ) = @ARG;

    $self->update_or_checkout();
    $self->working_copy->recurse( callback => _make_xml_finder() );
    return;
}

sub _make_xml_finder {
    my $self = shift;

    return sub {
        my $path = shift;
        return if $path->is_dir();

        my @dir_list = $path->dir->dir_list();
        return if 'CVS' ~~ @dir_list or '.svn' ~~ @dir_list;
        return if $path !~ / [.]xml \z/;

        $self->_twig->parsefile("$path");
    };
}

__PACKAGE__->meta->make_immutable();

1;

__END__

=head1 DESCRIPTION

=head1 SYNOPSIS

=for test_synopsis 1;

=for test_synopsis __END__

    perl -MGSI::Content::Cmd -e 'GSI::Content::Cmd->run()' deploy \
        --working_copy /path/to/dir
        --svn_url http://sample.com/svn/repo/trunk
