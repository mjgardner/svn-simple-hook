package GSI::Content::Config::Template;

# ABSTRACT: Subclass to fill in package for fill_in

use English '-no_match_vars';
use Moose;
use MooseX::NonMoose;
use namespace::autoclean;
extends 'Text::Template';

=for Pod::Coverage Q

=cut

{

    # make an alias to _load_text called "include"
    ## no critic (ProhibitCallsToUnexportedSubs, ProtectPrivateVars)
    *Q::include = \&Text::Template::_load_text;
}

around fill_in => sub {
    my ( $orig, $self ) = splice @ARG, 0, 2;
    return $self->$orig( PACKAGE => 'Q', @ARG );
};

no Moose;

__PACKAGE__->meta->make_immutable;

1;

__END__

=head1 DESCRIPTION

This is a simple L<Moose|Moose>-based subclass of
L<Text::Template|Text::Template> that adds an C<include> function to your
templates.

=head1 SYNOPSIS

    use GSI::Content::Config::Template;
    
    my $template = GSI::Content::Config::Template->new(
        TYPE   => 'FILE',
        SOURCE => 'foo.tmpl',
    );
    print $template->fill_in( HASH => { name => 'value' } );
