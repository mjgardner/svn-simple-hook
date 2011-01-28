package GSI::Automerge::Schema::Result::ScmFile;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

GSI::Automerge::Schema::Result::ScmFile

=cut

__PACKAGE__->table("scm_file");

=head1 ACCESSORS

=head2 file_id

  is_auto_increment: 1
  is_nullable: 0
  sequence: 'file_id_sequence'

=head2 component_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 0
  original: {data_type => "number"}
  size: [11,0]

=head2 file_name

  data_type: 'varchar2'
  is_nullable: 0
  size: 4000

=head2 lock_status_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: [11,0]

=head2 file_path

  data_type: 'varchar2'
  is_nullable: 0
  size: 255

=head2 branch_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 0
  original: {data_type => "number"}
  size: [11,0]

=head2 merge_status_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: [11,0]

=head2 time_stamp

  data_type: 'datetime'
  is_nullable: 1
  original: {data_type => "date"}

=head2 scm_author

  data_type: 'varchar2'
  is_nullable: 1
  size: 200

=head2 message_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: [11,0]

=head2 project_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: [11,0]

=cut

__PACKAGE__->add_columns(
  "file_id",
  {
    is_auto_increment => 1,
    is_nullable => 0,
    sequence => "file_id_sequence",
  },
  "component_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 0,
    original => { data_type => "number" },
    size => [11, 0],
  },
  "file_name",
  { data_type => "varchar2", is_nullable => 0, size => 4000 },
  "lock_status_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => [11, 0],
  },
  "file_path",
  { data_type => "varchar2", is_nullable => 0, size => 255 },
  "branch_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 0,
    original => { data_type => "number" },
    size => [11, 0],
  },
  "merge_status_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => [11, 0],
  },
  "time_stamp",
  {
    data_type   => "datetime",
    is_nullable => 1,
    original    => { data_type => "date" },
  },
  "scm_author",
  { data_type => "varchar2", is_nullable => 1, size => 200 },
  "message_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => [11, 0],
  },
  "project_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => [11, 0],
  },
);
__PACKAGE__->set_primary_key("file_id");
__PACKAGE__->add_unique_constraint(
  "scm_file_uk1",
  ["file_name", "component_id", "file_path", "branch_id"],
);

=head1 RELATIONS

=head2 branch

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::Branch>

=cut

__PACKAGE__->belongs_to(
  "branch",
  "GSI::Automerge::Schema::Result::Branch",
  { branch_id => "branch_id" },
  { is_deferrable => 1, on_delete => "CASCADE", on_update => "CASCADE" },
);

=head2 lock_status

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::Status>

=cut

__PACKAGE__->belongs_to(
  "lock_status",
  "GSI::Automerge::Schema::Result::Status",
  { status_id => "lock_status_id" },
  {
    is_deferrable => 1,
    join_type     => "LEFT",
    on_delete     => "CASCADE",
    on_update     => "CASCADE",
  },
);

=head2 merge_status

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::Status>

=cut

__PACKAGE__->belongs_to(
  "merge_status",
  "GSI::Automerge::Schema::Result::Status",
  { status_id => "merge_status_id" },
  {
    is_deferrable => 1,
    join_type     => "LEFT",
    on_delete     => "CASCADE",
    on_update     => "CASCADE",
  },
);

=head2 component

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::ScmComponent>

=cut

__PACKAGE__->belongs_to(
  "component",
  "GSI::Automerge::Schema::Result::ScmComponent",
  { component_id => "component_id" },
  { is_deferrable => 1, on_delete => "CASCADE", on_update => "CASCADE" },
);

=head2 project

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::ProjectList>

=cut

__PACKAGE__->belongs_to(
  "project",
  "GSI::Automerge::Schema::Result::ProjectList",
  { project_id => "project_id" },
  {
    is_deferrable => 1,
    join_type     => "LEFT",
    on_delete     => "CASCADE",
    on_update     => "CASCADE",
  },
);

=head2 message

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::Message>

=cut

__PACKAGE__->belongs_to(
  "message",
  "GSI::Automerge::Schema::Result::Message",
  { message_id => "message_id" },
  {
    is_deferrable => 1,
    join_type     => "LEFT",
    on_delete     => "CASCADE",
    on_update     => "CASCADE",
  },
);


# Created by DBIx::Class::Schema::Loader v0.07002 @ 2010-10-08 12:54:21
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:LFsZZphw07mZZk4GyjsRvA


# You can replace this text with custom content, and it will be preserved on regeneration
1;
