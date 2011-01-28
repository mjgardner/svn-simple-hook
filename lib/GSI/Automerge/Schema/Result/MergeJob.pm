package GSI::Automerge::Schema::Result::MergeJob;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

GSI::Automerge::Schema::Result::MergeJob

=cut

__PACKAGE__->table("merge_job");

=head1 ACCESSORS

=head2 job_id

  data_type: 'numeric'
  is_auto_increment: 1
  is_nullable: 0
  original: {data_type => "number"}
  sequence: 'm_jobs_sequence1'
  size: 126

=head2 from_branch

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: 126

=head2 to_branch

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: 126

=head2 module_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: 126

=head2 from_tag

  data_type: 'varchar2'
  is_nullable: 1
  size: 100

=head2 to_tag

  data_type: 'varchar2'
  is_nullable: 1
  size: 100

=head2 merge_time

  data_type: 'datetime'
  is_nullable: 1
  original: {data_type => "date"}

=head2 job_status_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: 126

=head2 activity_status

  data_type: 'varchar2'
  is_nullable: 1
  size: 20

=head2 group_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: 126

=head2 group_weight

  data_type: 'numeric'
  is_nullable: 1
  original: {data_type => "number"}
  size: 126

=head2 display

  data_type: 'varchar2'
  is_nullable: 1
  size: 5

=cut

__PACKAGE__->add_columns(
  "job_id",
  {
    data_type => "numeric",
    is_auto_increment => 1,
    is_nullable => 0,
    original => { data_type => "number" },
    sequence => "m_jobs_sequence1",
    size => 126,
  },
  "from_branch",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => 126,
  },
  "to_branch",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => 126,
  },
  "module_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => 126,
  },
  "from_tag",
  { data_type => "varchar2", is_nullable => 1, size => 100 },
  "to_tag",
  { data_type => "varchar2", is_nullable => 1, size => 100 },
  "merge_time",
  {
    data_type   => "datetime",
    is_nullable => 1,
    original    => { data_type => "date" },
  },
  "job_status_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => 126,
  },
  "activity_status",
  { data_type => "varchar2", is_nullable => 1, size => 20 },
  "group_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => 126,
  },
  "group_weight",
  {
    data_type => "numeric",
    is_nullable => 1,
    original => { data_type => "number" },
    size => 126,
  },
  "display",
  { data_type => "varchar2", is_nullable => 1, size => 5 },
);
__PACKAGE__->set_primary_key("job_id");

=head1 RELATIONS

=head2 automerge_logs

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::AutomergeLog>

=cut

__PACKAGE__->has_many(
  "automerge_logs",
  "GSI::Automerge::Schema::Result::AutomergeLog",
  { "foreign.merge_job_id" => "self.job_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 module

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::ScmComponent>

=cut

__PACKAGE__->belongs_to(
  "module",
  "GSI::Automerge::Schema::Result::ScmComponent",
  { component_id => "module_id" },
  {
    is_deferrable => 1,
    join_type     => "LEFT",
    on_delete     => "CASCADE",
    on_update     => "CASCADE",
  },
);

=head2 group

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::ScmComponent>

=cut

__PACKAGE__->belongs_to(
  "group",
  "GSI::Automerge::Schema::Result::ScmComponent",
  { component_id => "group_id" },
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

=head2 job_status

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::JobStatusCd>

=cut

__PACKAGE__->belongs_to(
  "job_status",
  "GSI::Automerge::Schema::Result::JobStatusCd",
  { job_status_id => "job_status_id" },
  {
    is_deferrable => 1,
    join_type     => "LEFT",
    on_delete     => "CASCADE",
    on_update     => "CASCADE",
  },
);

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


# Created by DBIx::Class::Schema::Loader v0.07005 @ 2011-01-28 17:11:19
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:4KZOUHF0EvWuBtT0EpDuMA


# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;
