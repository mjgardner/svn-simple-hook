package SVN::Simple::Path_Change;

# ABSTRACT: A class for easier manipulation of Subversion path changes

use English '-no_match_vars';
use Moose;
use MooseX::Has::Sugar;
use MooseX::Types::Path::Class qw(Dir File);
use SVN::Fs;
use namespace::autoclean;

=attr svn_change

The L<_p_svn_fs_path_change_t|SVN::Fs/_p_svn_fs_path_change_t> object as
returned from the C<< $root->paths_changed() >> method.

=cut

## no critic (RequireDotMatchAnything, RequireExtendedFormatting)
## no critic (RequireLineBoundaryMatching)
has svn_change =>
    ( ro, required, isa => '_p_svn_fs_path_change_t', handles => qr// );

=attr path

Either a L<Path::Class::Dir|Path::Class::Dir> or
L<Path::Class::File|Path::Class::File> representing the changed entity.

=cut

has path => ( ro, required, coerce, isa => Dir | File );

__PACKAGE__->meta->make_immutable();
1;

__END__

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