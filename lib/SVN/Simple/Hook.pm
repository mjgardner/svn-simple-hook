package SVN::Simple::Hook;

# ABSTRACT: Simple Moose-based framework for Subversion hooks

use strict;
use English '-no_match_vars';
use Moose::Role;
use MooseX::Has::Sugar;
use MooseX::Types::Moose 'Str';
use MooseX::Types::Path::Class 'Dir';
use Path::Class;
use SVN::Core;
use SVN::Repos;
use SVN::Fs;
use SVN::Simple::Path_Change;
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

Subversion L<repository object|SVN::Repos>.  Opened on first
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

=attr paths_changed

A hash reference where the keys are paths in the L</root> and values are
L<SVN::Simple::Path_Change|SVN::Simple::Path_Change> objects.  Enables hooks
to access the changes that triggered them.

=cut

has paths_changed => ( ro, required, lazy_build,
    isa      => 'HashRef[SVN::Simple::Path_Change]',
    init_arg => undef,
);

sub _build_paths_changed {    ## no critic (ProhibitUnusedPrivateSubroutines)
    my $self = shift;
    my $root = $self->root;
    my $fs   = $root->fs;

    my $rev_root    = $fs->revision_root( $fs->youngest_rev );
    my $changed_ref = $root->paths_changed;

    my %paths_changed;
    while ( my ( $path, $info_ref ) = each %{$changed_ref} ) {
        my $path_obj;
        if ( $root->is_dir($path) or $rev_root->is_dir($path) ) {
            $path_obj = dir($path);
        }
        if ( $root->is_file($path) or $rev_root->is_file($path) ) {
            $path_obj = file($path);
        }

        $paths_changed{$path} = SVN::Simple::Path_Change->new(
            svn_change => $info_ref,
            path       => $path_obj,
        );
    }
    return \%paths_changed;
}

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
