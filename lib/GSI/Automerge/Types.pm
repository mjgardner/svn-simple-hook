package GSI::Automerge::Types;

# ABSTRACT: Moose type library for GSI::Automerge

use DBI;
use English '-no_match_vars';
use MooseX::Types -declare => ['DSN'];
use MooseX::Types::Moose 'Str';

subtype DSN,    ## no critic (Subroutines::ProhibitCallsToUndeclaredSubs)
    as Str, where { my @dsn = DBI->parse_dsn($ARG); scalar @dsn },
    message {'String is not a valid DSN'};

1;

__END__

=head1 DESCRIPTION

Type library for Moose classes used by L<GSI::Automerge|GSI::Automerge>

=head1 SYNOPSIS

    package My::Class;
    
    use Moose;
    use GSI::Automerge::Types 'DSN';
    
    has dsn => ( isa => DSN );
