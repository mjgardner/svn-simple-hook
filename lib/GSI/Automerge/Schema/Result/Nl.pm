package GSI::Automerge::Schema::Result::Nl;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

GSI::Automerge::Schema::Result::Nl

=cut

__PACKAGE__->table("nl");

=head1 ACCESSORS

=head2 project_id

  data_type: 'numeric'
  is_nullable: 0
  original: {data_type => "number"}
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
    is_nullable => 0,
    original => { data_type => "number" },
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


# Created by DBIx::Class::Schema::Loader v0.07002 @ 2010-09-23 09:58:41
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:AR3sqCOLs0j260vCx4Xy1g


# You can replace this text with custom content, and it will be preserved on regeneration
1;
