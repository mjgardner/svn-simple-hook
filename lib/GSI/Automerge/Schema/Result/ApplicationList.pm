package GSI::Automerge::Schema::Result::ApplicationList;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

GSI::Automerge::Schema::Result::ApplicationList

=cut

__PACKAGE__->table("application_list");

=head1 ACCESSORS

=head2 application_id

  data_type: 'numeric'
  is_auto_increment: 1
  is_nullable: 0
  original: {data_type => "number"}
  sequence: 'application_id_sequence'
  size: [11,0]

=head2 application_name

  data_type: 'varchar2'
  is_nullable: 0
  size: 150

=head2 svn_url

  data_type: 'varchar2'
  is_nullable: 1
  size: 1000

=head2 maven_path

  data_type: 'varchar2'
  is_nullable: 1
  size: 1000

=head2 active

  data_type: 'varchar2'
  default_value: 'Y'
  is_nullable: 1
  size: 2

=head2 component_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: 126

=cut

__PACKAGE__->add_columns(
  "application_id",
  {
    data_type => "numeric",
    is_auto_increment => 1,
    is_nullable => 0,
    original => { data_type => "number" },
    sequence => "application_id_sequence",
    size => [11, 0],
  },
  "application_name",
  { data_type => "varchar2", is_nullable => 0, size => 150 },
  "svn_url",
  { data_type => "varchar2", is_nullable => 1, size => 1000 },
  "maven_path",
  { data_type => "varchar2", is_nullable => 1, size => 1000 },
  "active",
  { data_type => "varchar2", default_value => "Y", is_nullable => 1, size => 2 },
  "component_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => 126,
  },
);
__PACKAGE__->set_primary_key("application_id");
__PACKAGE__->add_unique_constraint("application_list_app_name", ["application_name"]);

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

=head2 project_lists

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::ProjectList>

=cut

__PACKAGE__->has_many(
  "project_lists",
  "GSI::Automerge::Schema::Result::ProjectList",
  { "foreign.application_id" => "self.application_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);


# Created by DBIx::Class::Schema::Loader v0.07005 @ 2011-01-28 17:11:19
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:cg2A60jFLmXa37mIB3sAtQ


# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;
