use Modern::Perl;
use utf8;

package inc::SVNMakeMaker;
use strict;

# VERSION
use Moose;
use MooseX::MarkAsMethods autoclean => 1;
extends 'Dist::Zilla::Plugin::MakeMaker::Awesome';

override _build_MakeFile_PL_template => sub {
    my ($self) = @_;

    my $template = super();
    $template .= <<'END_TEMPLATE';
if (eval {require Alien::SVN; 1}) {
    eval {require SVN::Core; SVN::Core->import; 1}
        or die 'botched Alien::SVN install detected, cannot continue';
}
END_TEMPLATE

    return $template;
};

__PACKAGE__->meta->make_immutable();
no Moose;
1;
