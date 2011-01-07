## no critic (NamingConventions::Capitalization)
package GSI::Content::Cmd::Command::check_lock::Types;

use English '-no_match_vars';
use MooseX::Types -declare => ['LockMessages'];
use MooseX::Types::Moose qw(HashRef);
use Readonly;
use Text::Template;
use namespace::autoclean;

Readonly my @MESSAGE_TYPES => qw(contact lock lta warning);

subtype LockMessages,
    as HashRef ['Text::Template'],
    where { @MESSAGE_TYPES ~~ $ARG },
    message {"hash keys must be @MESSAGE_TYPES"};

# make it so calls to $self->foo_message->fill_in(PACKAGE => 'Q')
# get an include function in the template
*Q = \&Text::Template::_load_text;

sub make_defaults {
    return map {
        $ARG => Text::Template->new(
            TYPE   => 'FILE',
            SOURCE => "conf/messages/{$ARG}.tmpl",
            )
    } @MESSAGE_TYPES;
}

__PACKAGE__->meta->make_immutable;

1;
__END__

=attr contact_message

=attr lock_message

=attr lta_message

=attr warning_message

These attributes contain L<Text::Template|Text::Template> objects used for
the different errors or warnings a user might receive on commit.  They default
to the contents of corresponding files in the F<conf/messages> directory
ending in <.tmpl>, e.g.:

=over

=item F<contact.tmpl>

=item F<lock.tmpl>

=item F<lta.tmpl>

=item F<warning.tmpl>

=back

=cut
