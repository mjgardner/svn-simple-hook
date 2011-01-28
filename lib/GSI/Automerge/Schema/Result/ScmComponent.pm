package GSI::Automerge::Schema::Result::ScmComponent;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

GSI::Automerge::Schema::Result::ScmComponent

=cut

__PACKAGE__->table("scm_component");

=head1 ACCESSORS

=head2 component_id

  data_type: 'numeric'
  is_auto_increment: 1
  is_nullable: 0
  original: {data_type => "number"}
  sequence: 'component_id_sequence'
  size: [11,0]

=head2 component_name

  data_type: 'varchar2'
  is_nullable: 0
  size: 4000

=head2 content_path

  data_type: 'varchar2'
  is_nullable: 1
  size: 4000

=head2 human_name

  data_type: 'varchar2'
  is_nullable: 1
  size: 1000

=head2 scm_lead

  data_type: 'varchar2'
  is_nullable: 1
  size: 100

=head2 scm_backup

  data_type: 'varchar2'
  is_nullable: 1
  size: 100

=head2 notes

  data_type: 'clob'
  is_nullable: 1

=head2 type

  data_type: 'varchar2'
  is_nullable: 1
  size: 20

=head2 host_id

  data_type: 'numeric'
  is_nullable: 1
  original: {data_type => "number"}
  size: 126

=head2 svn_url

  data_type: 'varchar2'
  is_nullable: 1
  size: 4000

=head2 active

  data_type: 'varchar2'
  default_value: 'Y'
  is_nullable: 1
  size: 3

=head2 ext_admin

  data_type: 'varchar2'
  is_nullable: 1
  size: 100

=cut

__PACKAGE__->add_columns(
  "component_id",
  {
    data_type => "numeric",
    is_auto_increment => 1,
    is_nullable => 0,
    original => { data_type => "number" },
    sequence => "component_id_sequence",
    size => [11, 0],
  },
  "component_name",
  { data_type => "varchar2", is_nullable => 0, size => 4000 },
  "content_path",
  { data_type => "varchar2", is_nullable => 1, size => 4000 },
  "human_name",
  { data_type => "varchar2", is_nullable => 1, size => 1000 },
  "scm_lead",
  { data_type => "varchar2", is_nullable => 1, size => 100 },
  "scm_backup",
  { data_type => "varchar2", is_nullable => 1, size => 100 },
  "notes",
  { data_type => "clob", is_nullable => 1 },
  "type",
  { data_type => "varchar2", is_nullable => 1, size => 20 },
  "host_id",
  {
    data_type => "numeric",
    is_nullable => 1,
    original => { data_type => "number" },
    size => 126,
  },
  "svn_url",
  { data_type => "varchar2", is_nullable => 1, size => 4000 },
  "active",
  { data_type => "varchar2", default_value => "Y", is_nullable => 1, size => 3 },
  "ext_admin",
  { data_type => "varchar2", is_nullable => 1, size => 100 },
);
__PACKAGE__->set_primary_key("component_id");
__PACKAGE__->add_unique_constraint("scm_component_uk1", ["component_name"]);

=head1 RELATIONS

=head2 application_lists

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::ApplicationList>

=cut

__PACKAGE__->has_many(
  "application_lists",
  "GSI::Automerge::Schema::Result::ApplicationList",
  { "foreign.component_id" => "self.component_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 automerge_logs

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::AutomergeLog>

=cut

__PACKAGE__->has_many(
  "automerge_logs",
  "GSI::Automerge::Schema::Result::AutomergeLog",
  { "foreign.component_id" => "self.component_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 branches

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::Branch>

=cut

__PACKAGE__->has_many(
  "branches",
  "GSI::Automerge::Schema::Result::Branch",
  { "foreign.component_id" => "self.component_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 exclusion_files

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::ExclusionFile>

=cut

__PACKAGE__->has_many(
  "exclusion_files",
  "GSI::Automerge::Schema::Result::ExclusionFile",
  { "foreign.component_id" => "self.component_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 merge_job_modules

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::MergeJob>

=cut

__PACKAGE__->has_many(
  "merge_job_modules",
  "GSI::Automerge::Schema::Result::MergeJob",
  { "foreign.module_id" => "self.component_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 merge_job_groups

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::MergeJob>

=cut

__PACKAGE__->has_many(
  "merge_job_groups",
  "GSI::Automerge::Schema::Result::MergeJob",
  { "foreign.group_id" => "self.component_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 scm_files

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::ScmFile>

=cut

__PACKAGE__->has_many(
  "scm_files",
  "GSI::Automerge::Schema::Result::ScmFile",
  { "foreign.component_id" => "self.component_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 svn_user_perms

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::SvnUserPerm>

=cut

__PACKAGE__->has_many(
  "svn_user_perms",
  "GSI::Automerge::Schema::Result::SvnUserPerm",
  { "foreign.component_id" => "self.component_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);


# Created by DBIx::Class::Schema::Loader v0.07005 @ 2011-01-28 17:11:19
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:UXCs/ryoidieuuGqPy1trg


# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;
