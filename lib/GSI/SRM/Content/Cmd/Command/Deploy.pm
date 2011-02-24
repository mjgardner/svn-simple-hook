package GSI::SRM::Content::Cmd::Command::Deploy;

# ABSTRACT: deploy and post-process content from SVN

use English '-no_match_vars';
use Moose;
use MooseX::Has::Sugar;
use MooseX::Types::URI 'Uri';
use SVN::Simple::Client::Types 'SvnUri';
use namespace::autoclean;
extends 'MooseX::App::Cmd::Command';
with 'MooseX::Getopt';
with 'SVN::Simple::Client::AsRole';
with 'GSI::SRM::Content::Role::Configurable';
with 'GSI::SRM::Content::Role::Minify';

has '+logger' => ( traits => ['NoGetopt'] );

for (qw(MooseX::Types::URI::Uri SVN::Simple::Client::Types::SvnUri)) {
    MooseX::Getopt::OptionTypeMap->add_option_type_to_map( $ARG => '=s' );
}

has buildfile_url => ( ro, coerce, lazy_build, isa => Uri );

sub _build_buildfile_url {    ## no critic (ProhibitUnusedPrivateSubroutines)
    my $url           = $ARG[0]->url->clone();
    my @path_segments = $url->path_segments;
    splice @path_segments, -1, 1, 'yui-build.xml';
    $url->path_segments(@path_segments);
    return $url;
}

=method execute

Runs the subcommand.

=cut

sub execute {
    my ( $self, $opt, $args ) = @ARG;
    $self->update_or_checkout();
    $self->context->export(
        $self->buildfile_url->as_string(),
        $self->working_copy->file('yui-build.xml')->stringify(),
        'HEAD', 0,
    );
    $self->minify();
    return;
}

__PACKAGE__->meta->make_immutable();
1;

__END__

=head1 DESCRIPTION

Command to deploy a Subversion repository and then minify it using
L<GSI::SRM::Content::Role::Minify|GSI::SRM::Content::Role::Minify>.

=head1 SYNOPSIS

=for test_synopsis 1;

=for test_synopsis __END__

    perl -MGSI::SRM::Content::Cmd -e 'GSI::SRM::Content::Cmd->run()' deploy \
        --working_copy /path/to/dir \
        --url http://sample.com/svn/repo/trunk
