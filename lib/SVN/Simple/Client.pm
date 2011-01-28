package SVN::Simple::Client;

# ABSTRACT: Simplified Subversion client for common use cases

use Moose;
use namespace::autoclean;
with 'SVN::Simple::Client::AsRole';

__PACKAGE__->meta->make_immutable;

1;
