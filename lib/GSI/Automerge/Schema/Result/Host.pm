package GSI::Automerge::Schema::Result::Host;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

GSI::Automerge::Schema::Result::Host

=cut

__PACKAGE__->table("host");

=head1 ACCESSORS

=head2 host_id

  data_type: 'numeric'
  is_auto_increment: 1
  is_nullable: 0
  original: {data_type => "number"}
  sequence: 'host_id_sequence'
  size: 126

=head2 host_name

  data_type: 'varchar2'
  is_nullable: 0
  size: 4000

=head2 svn_url

  data_type: 'varchar2'
  is_nullable: 1
  size: 4000

=head2 svn_host

  data_type: 'varchar2'
  default_value: 'N'
  is_nullable: 1
  size: 4

=head2 active

  data_type: 'varchar2'
  default_value: 'Y'
  is_nullable: 1
  size: 4

=cut

__PACKAGE__->add_columns(
  "host_id",
  {
    data_type => "numeric",
    is_auto_increment => 1,
    is_nullable => 0,
    original => { data_type => "number" },
    sequence => "host_id_sequence",
    size => 126,
  },
  "host_name",
  { data_type => "varchar2", is_nullable => 0, size => 4000 },
  "svn_url",
  { data_type => "varchar2", is_nullable => 1, size => 4000 },
  "svn_host",
  { data_type => "varchar2", default_value => "N", is_nullable => 1, size => 4 },
  "active",
  { data_type => "varchar2", default_value => "Y", is_nullable => 1, size => 4 },
);
__PACKAGE__->set_primary_key("host_id");
__PACKAGE__->add_unique_constraint("host_uk1", ["host_name"]);

=head1 RELATIONS

=head2 environment_admin_hosts

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::Environment>

=cut

__PACKAGE__->has_many(
  "environment_admin_hosts",
  "GSI::Automerge::Schema::Result::Environment",
  { "foreign.admin_host_id" => "self.host_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 environment_hosts

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::Environment>

=cut

__PACKAGE__->has_many(
  "environment_hosts",
  "GSI::Automerge::Schema::Result::Environment",
  { "foreign.host_id" => "self.host_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);


# Created by DBIx::Class::Schema::Loader v0.07005 @ 2011-01-28 17:11:19
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:Fk2QU6l/4x6W2Cg3J93uiQ


# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;
