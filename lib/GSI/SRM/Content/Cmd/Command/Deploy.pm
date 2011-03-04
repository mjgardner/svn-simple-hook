package GSI::SRM::Content::Cmd::Command::Deploy;

# ABSTRACT: deploy and post-process content from SVN

use English '-no_match_vars';
use File::Copy;
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

=method execute

Runs the subcommand.

=cut

sub execute {
    my ( $self, $opt, $args ) = @ARG;
    $self->update_or_checkout();
    $self->minify();

    ## XXX FIXME this is a horrible kluge with hardcoded paths
    my $wc = $self->working_copy;
    for my $dir1 (qw(concat minified)) {
        for my $dir2 (qw(css js)) {
            my $yui_out = $wc->subdir("target/yui/$dir1/$dir2");
            for ( $yui_out->children ) {
                move( $ARG, $wc->subdir( $dir2, $ARG->relative($yui_out) ) );
            }
        }
    }

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
