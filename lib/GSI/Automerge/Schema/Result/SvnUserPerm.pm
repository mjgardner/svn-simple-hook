package GSI::Automerge::Schema::Result::SvnUserPerm;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

GSI::Automerge::Schema::Result::SvnUserPerm

=cut

__PACKAGE__->table("svn_user_perm");

=head1 ACCESSORS

=head2 svn_perm_id

  data_type: 'numeric'
  is_auto_increment: 1
  is_nullable: 0
  original: {data_type => "number"}
  sequence: 'svn_perm_id_sequence'
  size: 126

=head2 component_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: 126

=head2 perm_def_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: 126

=head2 svn_url

  data_type: 'varchar2'
  is_nullable: 1
  size: 4000

=head2 exp_date

  data_type: 'datetime'
  is_nullable: 1
  original: {data_type => "date"}

=head2 comments

  data_type: 'clob'
  is_nullable: 1

=head2 group_name

  data_type: 'varchar2'
  is_nullable: 1
  size: 255

=head2 user_name

  data_type: 'varchar2'
  is_nullable: 1
  size: 255

=cut

__PACKAGE__->add_columns(
  "svn_perm_id",
  {
    data_type => "numeric",
    is_auto_increment => 1,
    is_nullable => 0,
    original => { data_type => "number" },
    sequence => "svn_perm_id_sequence",
    size => 126,
  },
  "component_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => 126,
  },
  "perm_def_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => 126,
  },
  "svn_url",
  { data_type => "varchar2", is_nullable => 1, size => 4000 },
  "exp_date",
  {
    data_type   => "datetime",
    is_nullable => 1,
    original    => { data_type => "date" },
  },
  "comments",
  { data_type => "clob", is_nullable => 1 },
  "group_name",
  { data_type => "varchar2", is_nullable => 1, size => 255 },
  "user_name",
  { data_type => "varchar2", is_nullable => 1, size => 255 },
);
__PACKAGE__->set_primary_key("svn_perm_id");
__PACKAGE__->add_unique_constraint(
  "svn_user_perm_uk1",
  ["component_id", "svn_url", "exp_date", "group_name", "user_name"],
);

=head1 RELATIONS

=head2 component

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::ScmComponent>

=cut

__PACKAGE__->belongs_to(
  "component",
  "GSI::Automerge::Schema::Result::ScmComponent",
  { component_id => "component_id" },
  {
    is_deferrable => 1,
    join_type     => "LEFT",
    on_delete     => "CASCADE",
    on_update     => "CASCADE",
  },
);

=head2 perm_def

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::PermissionDefinition>

=cut

__PACKAGE__->belongs_to(
  "perm_def",
  "GSI::Automerge::Schema::Result::PermissionDefinition",
  { perm_def_id => "perm_def_id" },
  {
    is_deferrable => 1,
    join_type     => "LEFT",
    on_delete     => "CASCADE",
    on_update     => "CASCADE",
  },
);


# Created by DBIx::Class::Schema::Loader v0.07005 @ 2011-01-28 17:11:19
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:AB3evqc0NRiSjl+R6hLytA


# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;
