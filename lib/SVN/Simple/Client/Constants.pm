package SVN::Simple::Client::Constants;

# ABSTRACT: Exports Subversion constants as hashes

use strict;
use Devel::Symdump;
use English '-no_match_vars';
use Exporter 'import';
use Readonly;
use SVN::Client;

our ( @EXPORT_OK, %EXPORT_TAGS );

=for :stopwords namespace runtime

=head1 EXPORTED CONSTANTS

None of these are imported into your namespace by default.  To import them
all, use the C<':all'> tag:

    use SVN::Simple::Client::Constants ':all';

=over

=item C<%ERROR_NAME>

Apache Portable Runtime error, as returned by the C<apr_err()> method of an
L<svn_error_t|SVN::Core/"svn_error_t - SVN::Error"> object.

=item C<%NODE_NAME>

Subversion node kind, as returned by the C<kind()> method of an
L<svn_wc_entry_t|SVN::Wc/svn_wc_entry_t> object.

=item C<%ACTION_NAME>

Type of action logged by a notification handler, as listed in
L<SVN::Wc::Notify::Action|SVN::Wc/SVN::Wc::Notify::Action>.

=item C<%STATE_NAME>

State of the working copy as logged by a notification handler, as listed in
L<SVN::Wc::Notify::State|SVN::Wc/SVN::Wc::Notify::State>.

=item C<%STATUS_NAME>

Status of a node, as listed in
L<SVN::Wc::Notify::Status|SVN::Wc/SVN::Wc::Notify::Status>.

=back

=cut

# map $SVN::<foo> constants to %<FOO>_NAME hashes,
# with the numeric values as keys so that we can look up names
for (
    qw(SVN::Error SVN::Node
    SVN::Wc::Notify::Action SVN::Wc::Notify::State SVN::Wc::Status)
    )
{
    my $name = uc substr( $ARG, rindex( $ARG, q{::} ) + 2 ) . '_NAME';
    no strict 'refs';
    Readonly %{ __PACKAGE__ . "::$name" } => (
        map { ${$ARG} => $ARG }
        grep { ${$ARG} and not ref ${$ARG} } Devel::Symdump->scalars($ARG)
    );
    push @EXPORT_OK, q{%} . $name;
}
%EXPORT_TAGS = ( all => \@EXPORT_OK );

1;

__END__

=head1 DESCRIPTION

This module exports the constants defined in various
L<SVN::Client|SVN::Client> packages as a set of hashes with the values of the
constants as keys.  This helps to convert the return values of
L<SVN::Client|SVN::Client> notification, status, and other calls into codes
that are more human-readable, albeit abbreviated.

=head1 SYNOPSIS

    use SVN::Client;
    use SVN::Simple::Client::Constants ':all';

    my $ctx = SVN::Client->new;
    $SVN::Error::handler = undef;   # handle our own errors

    my @out = $ctx->cat(\*STDOUT, 'http://sample.com/svn/repo/hello.txt', 'PREV');
    print $ERROR_NAME{ $out[0]->apr_err }, "\n";    # prints name of error constant
