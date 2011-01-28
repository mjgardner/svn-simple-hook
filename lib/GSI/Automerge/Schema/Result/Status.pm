package GSI::Automerge::Schema::Result::Status;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

GSI::Automerge::Schema::Result::Status

=cut

__PACKAGE__->table("status");

=head1 ACCESSORS

=head2 status_id

  is_auto_increment: 1
  is_nullable: 0
  sequence: 'status_id_sequence'

=head2 description

  data_type: 'varchar2'
  is_nullable: 1
  size: 255

=head2 status_value

  data_type: 'varchar2'
  is_nullable: 1
  size: 50

=head2 status_cd

  data_type: 'varchar2'
  is_nullable: 1
  size: 50

=head2 status_type

  data_type: 'varchar2'
  is_nullable: 1
  size: 3

=cut

__PACKAGE__->add_columns(
  "status_id",
  {
    is_auto_increment => 1,
    is_nullable => 0,
    sequence => "status_id_sequence",
  },
  "description",
  { data_type => "varchar2", is_nullable => 1, size => 255 },
  "status_value",
  { data_type => "varchar2", is_nullable => 1, size => 50 },
  "status_cd",
  { data_type => "varchar2", is_nullable => 1, size => 50 },
  "status_type",
  { data_type => "varchar2", is_nullable => 1, size => 3 },
);
__PACKAGE__->set_primary_key("status_id");

=head1 RELATIONS

=head2 branch_merge_statuses

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::Branch>

=cut

__PACKAGE__->has_many(
  "branch_merge_statuses",
  "GSI::Automerge::Schema::Result::Branch",
  { "foreign.merge_status_id" => "self.status_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 branch_lock_statuses

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::Branch>

=cut

__PACKAGE__->has_many(
  "branch_lock_statuses",
  "GSI::Automerge::Schema::Result::Branch",
  { "foreign.lock_status_id" => "self.status_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 branch_default_lock_statuses

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::Branch>

=cut

__PACKAGE__->has_many(
  "branch_default_lock_statuses",
  "GSI::Automerge::Schema::Result::Branch",
  { "foreign.default_lock_status_id" => "self.status_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 scm_file_lock_statuses

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::ScmFile>

=cut

__PACKAGE__->has_many(
  "scm_file_lock_statuses",
  "GSI::Automerge::Schema::Result::ScmFile",
  { "foreign.lock_status_id" => "self.status_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 scm_file_merge_statuses

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::ScmFile>

=cut

__PACKAGE__->has_many(
  "scm_file_merge_statuses",
  "GSI::Automerge::Schema::Result::ScmFile",
  { "foreign.merge_status_id" => "self.status_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);


# Created by DBIx::Class::Schema::Loader v0.07002 @ 2010-09-23 09:58:41
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:zQaIwnVJub5OklFhjvlp+A


# You can replace this text with custom content, and it will be preserved on regeneration
1;
