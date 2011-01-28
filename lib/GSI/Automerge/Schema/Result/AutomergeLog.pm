package GSI::Automerge::Schema::Result::AutomergeLog;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

GSI::Automerge::Schema::Result::AutomergeLog

=cut

__PACKAGE__->table("automerge_log");

=head1 ACCESSORS

=head2 log_id

  data_type: 'numeric'
  is_auto_increment: 1
  is_nullable: 0
  original: {data_type => "number"}
  sequence: 'automerge_log_seq'
  size: [11,0]

=head2 merge_job_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 0
  original: {data_type => "number"}
  size: [11,0]

=head2 merge_job_time

  data_type: 'datetime'
  is_nullable: 0
  original: {data_type => "date"}

=head2 merge_job_status

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: [11,0]

=head2 merge_job_output

  data_type: 'clob'
  is_nullable: 1

=head2 from_branch

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: [11,0]

=head2 to_branch

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: [11,0]

=head2 merge_tag

  data_type: 'varchar2'
  is_nullable: 1
  size: 100

=head2 component_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: [11,0]

=cut

__PACKAGE__->add_columns(
  "log_id",
  {
    data_type => "numeric",
    is_auto_increment => 1,
    is_nullable => 0,
    original => { data_type => "number" },
    sequence => "automerge_log_seq",
    size => [11, 0],
  },
  "merge_job_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 0,
    original => { data_type => "number" },
    size => [11, 0],
  },
  "merge_job_time",
  {
    data_type   => "datetime",
    is_nullable => 0,
    original    => { data_type => "date" },
  },
  "merge_job_status",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => [11, 0],
  },
  "merge_job_output",
  { data_type => "clob", is_nullable => 1 },
  "from_branch",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => [11, 0],
  },
  "to_branch",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => [11, 0],
  },
  "merge_tag",
  { data_type => "varchar2", is_nullable => 1, size => 100 },
  "component_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => [11, 0],
  },
);
__PACKAGE__->set_primary_key("log_id");

=head1 RELATIONS

=head2 to_branch

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::Branch>

=cut

__PACKAGE__->belongs_to(
  "to_branch",
  "GSI::Automerge::Schema::Result::Branch",
  { branch_id => "to_branch" },
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

=head2 from_branch

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::Branch>

=cut

__PACKAGE__->belongs_to(
  "from_branch",
  "GSI::Automerge::Schema::Result::Branch",
  { branch_id => "from_branch" },
  {
    is_deferrable => 1,
    join_type     => "LEFT",
    on_delete     => "CASCADE",
    on_update     => "CASCADE",
  },
);

=head2 merge_job

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::MergeJob>

=cut

__PACKAGE__->belongs_to(
  "merge_job",
  "GSI::Automerge::Schema::Result::MergeJob",
  { job_id => "merge_job_id" },
  { is_deferrable => 1, on_delete => "CASCADE", on_update => "CASCADE" },
);

=head2 merge_job_status

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::JobStatusCd>

=cut

__PACKAGE__->belongs_to(
  "merge_job_status",
  "GSI::Automerge::Schema::Result::JobStatusCd",
  { job_status_id => "merge_job_status" },
  {
    is_deferrable => 1,
    join_type     => "LEFT",
    on_delete     => "CASCADE",
    on_update     => "CASCADE",
  },
);


# Created by DBIx::Class::Schema::Loader v0.07005 @ 2011-01-28 17:11:19
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:F3N5QjtWILreeloczvnvng


# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;
