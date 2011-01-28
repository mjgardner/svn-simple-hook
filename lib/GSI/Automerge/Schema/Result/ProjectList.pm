package GSI::Automerge::Schema::Result::ProjectList;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

GSI::Automerge::Schema::Result::ProjectList

=cut

__PACKAGE__->table("project_list");

=head1 ACCESSORS

=head2 project_id

  data_type: 'numeric'
  is_auto_increment: 1
  is_nullable: 0
  original: {data_type => "number"}
  sequence: 'project_id_sequence'
  size: [11,0]

=head2 project_name

  data_type: 'varchar2'
  is_nullable: 1
  size: 50

=head2 project_desc

  data_type: 'varchar2'
  is_nullable: 1
  size: 255

=head2 gsi_id

  data_type: 'varchar2'
  is_nullable: 1
  size: 4000

=head2 contacts

  data_type: 'varchar2'
  is_nullable: 1
  size: 4000

=head2 pm

  data_type: 'varchar2'
  is_nullable: 1
  size: 4000

=head2 golive_date

  data_type: 'varchar2'
  is_nullable: 1
  size: 4000

=head2 application_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: 126

=head2 notes

  data_type: 'clob'
  is_nullable: 1

=head2 branch_name

  data_type: 'varchar2'
  is_nullable: 1
  size: 4000

=head2 status

  data_type: 'varchar2'
  is_nullable: 1
  size: 4000

=head2 target

  data_type: 'varchar2'
  is_nullable: 1
  size: 4000

=head2 dimensions_id

  data_type: 'varchar2'
  is_nullable: 1
  size: 4000

=cut

__PACKAGE__->add_columns(
  "project_id",
  {
    data_type => "numeric",
    is_auto_increment => 1,
    is_nullable => 0,
    original => { data_type => "number" },
    sequence => "project_id_sequence",
    size => [11, 0],
  },
  "project_name",
  { data_type => "varchar2", is_nullable => 1, size => 50 },
  "project_desc",
  { data_type => "varchar2", is_nullable => 1, size => 255 },
  "gsi_id",
  { data_type => "varchar2", is_nullable => 1, size => 4000 },
  "contacts",
  { data_type => "varchar2", is_nullable => 1, size => 4000 },
  "pm",
  { data_type => "varchar2", is_nullable => 1, size => 4000 },
  "golive_date",
  { data_type => "varchar2", is_nullable => 1, size => 4000 },
  "application_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => 126,
  },
  "notes",
  { data_type => "clob", is_nullable => 1 },
  "branch_name",
  { data_type => "varchar2", is_nullable => 1, size => 4000 },
  "status",
  { data_type => "varchar2", is_nullable => 1, size => 4000 },
  "target",
  { data_type => "varchar2", is_nullable => 1, size => 4000 },
  "dimensions_id",
  { data_type => "varchar2", is_nullable => 1, size => 4000 },
);
__PACKAGE__->set_primary_key("project_id");

=head1 RELATIONS

=head2 application

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::ApplicationList>

=cut

__PACKAGE__->belongs_to(
  "application",
  "GSI::Automerge::Schema::Result::ApplicationList",
  { application_id => "application_id" },
  {
    is_deferrable => 1,
    join_type     => "LEFT",
    on_delete     => "CASCADE",
    on_update     => "CASCADE",
  },
);

=head2 scm_files

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::ScmFile>

=cut

__PACKAGE__->has_many(
  "scm_files",
  "GSI::Automerge::Schema::Result::ScmFile",
  { "foreign.project_id" => "self.project_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);


# Created by DBIx::Class::Schema::Loader v0.07005 @ 2011-01-28 17:11:19
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:bGRTPSh98BIeId8Kg4oMeg


# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;
