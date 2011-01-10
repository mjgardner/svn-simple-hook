package GSI::Content::Config::Types;

# ABSTRACT: Moose type library for GSI content configuration

use strict;
use English '-no_match_vars';
use MooseX::Types -declare => ['Messages'];
use MooseX::Types::Moose qw(HashRef);
use Readonly;
use namespace::autoclean;

Readonly our @MESSAGE_TYPES => qw(contact lock author warning);

=attr Messages

A hash reference where the values are L<Text::Template|Text::Template>
objects.

Each hash item contains an error or warning a user might receive on commit.

=over

=item contact

Contact information to help resolve any issues.

=item lock

Error message received when attempting to commit a previously-locked file.

=item author

Error message received when attempting to commit a file that has been locked
by a different author.

=item warning

Warning received when attempting to commit to a file with a I<WARNING> flag
set.

=back

=cut

subtype Messages,    ## no critic (ProhibitCallsToUndeclaredSubs)
    as HashRef ['GSI::Content::Config::Template'],
    where { @MESSAGE_TYPES ~~ %{$ARG} },
    message {"hash keys must be @MESSAGE_TYPES"};

__PACKAGE__->meta->make_immutable;

1;

__END__

=head1 DESCRIPTION

This module defines subtypes used by
L<GSI::Content::Config|GSI::Content::Config>.

=head1 SYNOPSIS

    package MyClass;
    
    use Moose;
    use GSI::Content::Config::Types 'Messages';

    has messages => (
        is  => 'rw',
        isa => Messages,
    );

    1;
