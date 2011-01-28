package GSI::Automerge::Schema::Result::Environment;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

GSI::Automerge::Schema::Result::Environment

=cut

__PACKAGE__->table("environment");

=head1 ACCESSORS

=head2 environment_id

  is_auto_increment: 1
  is_nullable: 0
  sequence: 'environment_id_sequence'

=head2 environment_name

  data_type: 'varchar2'
  is_nullable: 1
  size: 4000

=head2 host_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: 126

=head2 admin_host_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: 126

=head2 active

  data_type: 'varchar2'
  default_value: 'Y'
  is_nullable: 1
  size: 4

=head2 environment_type

  data_type: 'varchar2'
  is_nullable: 1
  size: 20

=head2 weblogic_url

  data_type: 'varchar2'
  is_nullable: 1
  size: 4000

=cut

__PACKAGE__->add_columns(
  "environment_id",
  {
    is_auto_increment => 1,
    is_nullable => 0,
    sequence => "environment_id_sequence",
  },
  "environment_name",
  { data_type => "varchar2", is_nullable => 1, size => 4000 },
  "host_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => 126,
  },
  "admin_host_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => 126,
  },
  "active",
  { data_type => "varchar2", default_value => "Y", is_nullable => 1, size => 4 },
  "environment_type",
  { data_type => "varchar2", is_nullable => 1, size => 20 },
  "weblogic_url",
  { data_type => "varchar2", is_nullable => 1, size => 4000 },
);
__PACKAGE__->set_primary_key("environment_id");

=head1 RELATIONS

=head2 admin_host

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::Host>

=cut

__PACKAGE__->belongs_to(
  "admin_host",
  "GSI::Automerge::Schema::Result::Host",
  { host_id => "admin_host_id" },
  {
    is_deferrable => 1,
    join_type     => "LEFT",
    on_delete     => "CASCADE",
    on_update     => "CASCADE",
  },
);

=head2 host

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::Host>

=cut

__PACKAGE__->belongs_to(
  "host",
  "GSI::Automerge::Schema::Result::Host",
  { host_id => "host_id" },
  {
    is_deferrable => 1,
    join_type     => "LEFT",
    on_delete     => "CASCADE",
    on_update     => "CASCADE",
  },
);


# Created by DBIx::Class::Schema::Loader v0.07002 @ 2010-12-06 13:03:35
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:ORg5E7Gr61tbP0qBUJ9ovA


# You can replace this text with custom content, and it will be preserved on regeneration
1;
