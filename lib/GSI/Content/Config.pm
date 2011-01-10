package GSI::Content::Config;

# ABSTRACT: GSI content configuration role

use strict;
use English '-no_match_vars';
use Moose::Role;
use MooseX::Has::Sugar;
use Readonly;
use GSI::Content::Config::Template;
use GSI::Content::Config::Types 'Messages';

Readonly my $MESSAGES_DIR => 'conf/messages';

=attr messages

L<Messages|GSI::Content::Config::Types/Messages>
containing an error or warning a user might receive on commit.

=cut

has messages => (
    rw,
    isa     => Messages,
    traits  => ['Hash'],
    handles => { message => 'accessor' },
    builder => '_build_messages',
);

sub _build_messages {    ## no critic (ProhibitUnusedPrivateSubroutines)
    return { map { $ARG => _make_template($ARG) }
            @GSI::Content::Config::Types::MESSAGE_TYPES };
}

sub _make_template {
    return GSI::Content::Config::Template->new(
        TYPE   => 'FILE',
        SOURCE => "$MESSAGES_DIR/$ARG[0].tmpl",
    );
}

1;

__END__

=head1 DESCRIPTION

L<Moose::Role|Moose::Role> for GSI content configuration information.

=head1 SYNOPSIS

    package MyClass;
    use Moose;
    with 'GSI::Content::Config';

    sub some_method {
        my $self = shift;
        print $self->message('contact');
    }

    1;
