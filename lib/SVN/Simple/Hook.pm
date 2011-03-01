package SVN::Simple::Hook;

# ABSTRACT: Simple Moose-based framework for Subversion hooks

use strict;
use English '-no_match_vars';
use Moose::Role;
use MooseX::Has::Sugar;
use MooseX::Types::Moose 'Str';
use MooseX::Types::Path::Class 'Dir';
use SVN::Core;
use SVN::Repos;
use SVN::Fs;
use namespace::autoclean;
with 'MooseX::Getopt';

=attr repos_path

L<Directory|Path::Class::Dir> containing the Subversion repository.

=cut

has repos_path => (
    ro, required, coerce,
    traits        => ['Getopt'],
    isa           => Dir,
    cmd_aliases   => [qw(r repo repos repository repository_dir)],
    documentation => 'repository path',
);

=attr repository

Subversion L<repository object|SVN::Repos/_p_svn_repos_t>.  Opened on first
call to the accessor.

=cut

has repository => (
    ro, required, lazy,
    isa      => '_p_svn_repos_t',
    init_arg => undef,
    ## no critic (ProhibitCallsToUnexportedSubs)
    default => sub { SVN::Repos::open( shift->repos_path->stringify() ) },
);

=attr author

Author of the current revision or transaction.  Role consumers must provide a
C<_build_author> method to set a default value.

=cut

has author => ( ro, required, lazy_build, isa => Str, init_arg => undef );

=attr root

L<Subversion root object|SVN::Fs/_p_svn_fs_root_t> from the repository.  Role
consumers must provide a C<_build_root> method to set a default value.

=cut

has root => ( ro, required, lazy_build,
    isa      => '_p_svn_fs_root_t',
    init_arg => undef,
);

1;

__END__

=head1 SYNOPSIS

=for test_synopsis 1;

=for test_synopsis __END__

=head1 SEE ALSO

See L<SVN::Simple::Hook::PreCommit|SVN::Simple::Hook::PreCommit/SYNOPSIS> for
an example.  This role exists solely to be composed into other roles.

=head1 DESCRIPTION

This is a collection of L<Moose::Role|Moose::Role>s that help you implement
Subversion repository hooks by providing simple attribute access to relevant
parts of the Subversion API.  This is a work in progress and the interface
is extremely unstable at the moment.  You have been warned!
