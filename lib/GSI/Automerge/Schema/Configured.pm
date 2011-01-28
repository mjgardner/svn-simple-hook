package GSI::Automerge::Schema::Configured;

# ABSTRACT: Generates connections to automerge schema

use Class::Inspector;
use English '-no_match_vars';
use Moose;
use MooseX::Has::Sugar;
use MooseX::Types::Moose 'Str';
use GSI::Automerge::Types 'DSN';
use GSI::Automerge::Schema;
use namespace::autoclean;
with 'MooseX::SimpleConfig';
with 'MooseX::Getopt';

=attr configfile

Provided by L<MooseX::SimpleConfig|MooseX::SimpleConfig>.
Defaults to F<database.ini>.

=cut

has '+configfile' => ( default => 'database.ini' );

=attr dsn

String describing the connection to the Automerge authorization database in
Perl L<DBI|DBI> format.  Defaults to C<dbi:Oracle:merasdv>.

=cut

has dsn => (
    ro, required,
    traits        => ['Getopt'],
    isa           => DSN,
    default       => 'dbi:Oracle:merasdv',
    documentation => 'Perl DBI database source name',
);

=attr username

Username for connecting to the Automerge authorization database.
Defaults to C<byronm> (the production database schema).

=cut

has username => (
    ro, required,
    traits        => ['Getopt'],
    isa           => Str,
    cmd_aliases   => [qw(dbu dbuser db_user)],
    default       => 'byronm',
    documentation => 'authorization database username',
);

=attr password

Password for connecting to the Automerge authorization database.
Defaults to C<password>.

=cut

has password => (
    ro, required,
    traits        => ['Getopt'],
    isa           => Str,
    cmd_aliases   => [qw(dbp dbpass db_pass)],
    default       => 'password',
    documentation => 'authorization database password',
);

has _schema => ( ro, required, lazy_build,
    isa => 'DBIx::Class::Schema',
    handles =>
        [ Class::Inspector->methods( 'GSI::Automerge::Schema', 'public' ) ],
);

sub _build__schema {    ## no critic (ProhibitUnusedPrivateSubroutines)
    my $self = shift;
    return GSI::Automerge::Schema->connect(
        ( map { $self->$ARG } qw(dsn username password) ),
        {   AutoCommit      => 1,
            RaiseError      => 1,
            PrintError      => 0,
            LongTruncOk     => 1,
            ora_module_name => $PROGRAM_NAME,
        },
        { on_connect_call => 'datetime_setup' },
        @ARG,
    );
}

1;

__END__

=head1 DESCRIPTION

Objects in this class generate <GSI::Automerge::Schema|GSI::Automerge::Schema>
connections by passing along calls to the
<connect|DBIx::Class::Schema/connect> method, either configured by attributes
or by loading a configuration file.

The following defaults are also set:

=over

=item C<AutoCommit>: true

=item C<RaiseError>: true

=item C<PrintError>: false

=item C<LongTruncOk>: true

=item C<ora_module_name>: current program name

=back

It also sets the C<on_connect_call> callback to
L<datetime_setup|DBIx::Class::Storage::DBI/datetime_setup>.

=head1 SYNOPSIS

    use GSI::Automerge::Schema::Configured;

    my $schema = GSI::Automerge::Schema::Configured->new(
        configfile => 'config.ini',
    );
    my $rs = $schema->resultset('SvnUserPerm')->search(
        'perm_def.perm_level' => { like => '%Write%' },
        join => [ 'perm_def', { component => 'host' } ],
    );
