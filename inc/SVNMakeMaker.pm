use Modern::Perl;
use utf8;

package inc::SVNMakeMaker;
use strict;

# VERSION
use Moose;
extends 'Dist::Zilla::Plugin::MakeMaker::Awesome';

override _build_MakeFile_PL_template => sub {
    my ($self) = @_;

    my $template = super();
    $template .= <<'END_TEMPLATE';
eval {
    eval { require Alien::SVN } and require SVN::Core;
} or die 'botched Alien::SVN install detected, cannot continue';
END_TEMPLATE

    return $template;
};

__PACKAGE__->meta->make_immutable();
no Moose;
1;
