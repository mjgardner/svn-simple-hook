package GSI::Automerge::Schema::Result::PermissionDefinition;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

GSI::Automerge::Schema::Result::PermissionDefinition

=cut

__PACKAGE__->table("permission_definitions");

=head1 ACCESSORS

=head2 perm_def_id

  data_type: 'numeric'
  is_nullable: 0
  original: {data_type => "number"}
  size: 126

=head2 perm_level

  data_type: 'varchar2'
  is_nullable: 0
  size: 20

=cut

__PACKAGE__->add_columns(
  "perm_def_id",
  {
    data_type => "numeric",
    is_nullable => 0,
    original => { data_type => "number" },
    size => 126,
  },
  "perm_level",
  { data_type => "varchar2", is_nullable => 0, size => 20 },
);
__PACKAGE__->set_primary_key("perm_def_id");

=head1 RELATIONS

=head2 svn_user_perms

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::SvnUserPerm>

=cut

__PACKAGE__->has_many(
  "svn_user_perms",
  "GSI::Automerge::Schema::Result::SvnUserPerm",
  { "foreign.perm_def_id" => "self.perm_def_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);


# Created by DBIx::Class::Schema::Loader v0.07002 @ 2010-10-08 12:54:21
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:R7jRmSgYH9GEkE8druCUWQ


# You can replace this text with custom content, and it will be preserved on regeneration
1;
