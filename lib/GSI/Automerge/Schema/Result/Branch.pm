package GSI::Automerge::Schema::Result::Branch;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

GSI::Automerge::Schema::Result::Branch

=cut

__PACKAGE__->table("branch");

=head1 ACCESSORS

=head2 branch_id

  is_auto_increment: 1
  is_nullable: 0
  sequence: 'branch_id_sequence'

=head2 branch_name

  data_type: 'varchar2'
  is_nullable: 1
  size: 4000

=head2 branch_type

  data_type: 'varchar2'
  is_nullable: 1
  size: 50

=head2 begin_time_stamp

  data_type: 'datetime'
  is_nullable: 1
  original: {data_type => "date"}

=head2 end_time_stamp

  data_type: 'datetime'
  is_nullable: 1
  original: {data_type => "date"}

=head2 lock_status_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: [11,0]

=head2 merge_status_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: [11,0]

=head2 branch_source

  data_type: 'varchar2'
  is_nullable: 1
  size: 55

=head2 default_lock_status_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: [11,0]

=head2 component_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: 126

=head2 dist_list

  data_type: 'varchar2'
  is_nullable: 1
  size: 4000

=head2 notes

  data_type: 'clob'
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "branch_id",
  {
    is_auto_increment => 1,
    is_nullable => 0,
    sequence => "branch_id_sequence",
  },
  "branch_name",
  { data_type => "varchar2", is_nullable => 1, size => 4000 },
  "branch_type",
  { data_type => "varchar2", is_nullable => 1, size => 50 },
  "begin_time_stamp",
  {
    data_type   => "datetime",
    is_nullable => 1,
    original    => { data_type => "date" },
  },
  "end_time_stamp",
  {
    data_type   => "datetime",
    is_nullable => 1,
    original    => { data_type => "date" },
  },
  "lock_status_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
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
  "branch_source",
  { data_type => "varchar2", is_nullable => 1, size => 55 },
  "default_lock_status_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => [11, 0],
  },
  "component_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => 126,
  },
  "dist_list",
  { data_type => "varchar2", is_nullable => 1, size => 4000 },
  "notes",
  { data_type => "clob", is_nullable => 1 },
);
__PACKAGE__->set_primary_key("branch_id");
__PACKAGE__->add_unique_constraint("branch_uk1", ["branch_name", "component_id"]);

=head1 RELATIONS

=head2 automerge_logs_to_branch

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::AutomergeLog>

=cut

__PACKAGE__->has_many(
  "automerge_logs_to_branch",
  "GSI::Automerge::Schema::Result::AutomergeLog",
  { "foreign.to_branch" => "self.branch_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 automerge_logs_from_branch

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::AutomergeLog>

=cut

__PACKAGE__->has_many(
  "automerge_logs_from_branch",
  "GSI::Automerge::Schema::Result::AutomergeLog",
  { "foreign.from_branch" => "self.branch_id" },
  { cascade_copy => 0, cascade_delete => 0 },
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
  {
    is_deferrable => 1,
    join_type     => "LEFT",
    on_delete     => "CASCADE",
    on_update     => "CASCADE",
  },
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

=head2 default_lock_status

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::Status>

=cut

__PACKAGE__->belongs_to(
  "default_lock_status",
  "GSI::Automerge::Schema::Result::Status",
  { status_id => "default_lock_status_id" },
  {
    is_deferrable => 1,
    join_type     => "LEFT",
    on_delete     => "CASCADE",
    on_update     => "CASCADE",
  },
);

=head2 merge_jobs_from_branch

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::MergeJob>

=cut

__PACKAGE__->has_many(
  "merge_jobs_from_branch",
  "GSI::Automerge::Schema::Result::MergeJob",
  { "foreign.from_branch" => "self.branch_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 merge_jobs_to_branch

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::MergeJob>

=cut

__PACKAGE__->has_many(
  "merge_jobs_to_branch",
  "GSI::Automerge::Schema::Result::MergeJob",
  { "foreign.to_branch" => "self.branch_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 scm_files

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::ScmFile>

=cut

__PACKAGE__->has_many(
  "scm_files",
  "GSI::Automerge::Schema::Result::ScmFile",
  { "foreign.branch_id" => "self.branch_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);


# Created by DBIx::Class::Schema::Loader v0.07002 @ 2010-09-23 09:58:41
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:dAlDHlYByJTlilYe5+ilLQ


# You can replace this text with custom content, and it will be preserved on regeneration
1;
