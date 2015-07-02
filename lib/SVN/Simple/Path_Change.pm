use utf8;
use Modern::Perl;

package SVN::Simple::Path_Change;
use strict;

# VERSION
use Any::Moose;
use Any::Moose '::Util::TypeConstraints';
use Any::Moose 'X::Types::Moose'       => ['Undef'];
use Any::Moose 'X::Types::Path::Class' => [qw(Dir File)];
use List::Util 1.33 'none';
use Path::Class;
use SVN::Core;
use SVN::Fs;
use namespace::autoclean;

my @methods;
for my $method ( map { $_->name }
    any_moose('::Meta::Class')->initialize('_p_svn_fs_path_change_t')
    ->get_all_methods() )
{
    if ( none { $method eq $_ } qw(new OFFSET) ) {
        push @methods => $method;
    }
}

has svn_change => (
    is       => 'ro',
    isa      => '_p_svn_fs_path_change_t',
    required => 1,
    handles  => \@methods,
);

coerce Dir,  from Undef => via { dir(q{}) };
coerce File, from Undef => via { file($_) };

has path => (
    is       => 'ro',
    isa      => Dir | File,    ## no critic (Bangs::ProhibitBitwiseOperators)
    required => 1,
    coerce   => 1,
);

1;

# ABSTRACT: A class for easier manipulation of Subversion path changes

=head1 SYNOPSIS

    use SVN::Simple::Path_Change;
    use SVN::Core;
    use SVN::Fs;
    use SVN::Repos;

    my $repos = SVN::Repos::open('/path/to/svn/repos');
    my $fs = $repos->fs;
    my %paths_changed = %{$fs->revision_root($fs->youngest_rev)->paths_changed};

    my @path_changes  = map {
        SVN::Simple::Path_Change->new(
            path       => $_,
            svn_change => $paths_changed{$_},
    ) } keys %paths_changed;

=head1 DESCRIPTION

This is a simple class that wraps a
L<Subversion path change object|SVN::Fs/_p_svn_fs_path_change_t> along with the
path it describes.

=head1 METHODS

All the methods supported by
L<_p_svn_fs_path_change_t|SVN::Fs/_p_svn_fs_path_change_t> are delegated by and
act on the L</svn_change> attribute.

=attr svn_change

The L<_p_svn_fs_path_change_t|SVN::Fs/_p_svn_fs_path_change_t> object as
returned from the C<< $root->paths_changed() >> method.

=attr path

Undefined, or a L<Path::Class::Dir|Path::Class::Dir> or
L<Path::Class::File|Path::Class::File> representing the changed entity.
