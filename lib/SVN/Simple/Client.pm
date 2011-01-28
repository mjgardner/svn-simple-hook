package SVN::Simple::Client;

# ABSTRACT: Simplified Subversion client for common use cases

use Moose;
use namespace::autoclean;
with 'SVN::Simple::Client::AsRole';

__PACKAGE__->meta->make_immutable;

1;

__END__

=head1 DESCRIPTION

Class-based wrapper around
L<SVN::Simple::Client::AsRole|SVN::Simple::Client::AsRole>

=head1 SYNOPSIS

    use SVN::Simple::Client;

    my $svn = SVN::Simple::Client->new(
        username     => 'mjg',
        password     => 'MYPASSWORD',
        working_copy => './checkout',
        url          => 'http://sample.com/svn/repo/trunk',
    );
