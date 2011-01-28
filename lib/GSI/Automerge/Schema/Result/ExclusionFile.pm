package GSI::Automerge::Schema::Result::ExclusionFile;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

GSI::Automerge::Schema::Result::ExclusionFile

=cut

__PACKAGE__->table("exclusion_file");

=head1 ACCESSORS

=head2 file_id

  data_type: 'numeric'
  is_auto_increment: 1
  is_nullable: 0
  original: {data_type => "number"}
  sequence: 'exclusion_file_seq'
  size: 126

=head2 file_name

  data_type: 'varchar2'
  is_nullable: 0
  size: 255

=head2 file_path

  data_type: 'varchar2'
  is_nullable: 1
  size: 255

=head2 component_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 0
  original: {data_type => "number"}
  size: 126

=cut

__PACKAGE__->add_columns(
  "file_id",
  {
    data_type => "numeric",
    is_auto_increment => 1,
    is_nullable => 0,
    original => { data_type => "number" },
    sequence => "exclusion_file_seq",
    size => 126,
  },
  "file_name",
  { data_type => "varchar2", is_nullable => 0, size => 255 },
  "file_path",
  { data_type => "varchar2", is_nullable => 1, size => 255 },
  "component_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 0,
    original => { data_type => "number" },
    size => 126,
  },
);
__PACKAGE__->set_primary_key("file_id");

=head1 RELATIONS

=head2 component

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::ScmComponent>

=cut

__PACKAGE__->belongs_to(
  "component",
  "GSI::Automerge::Schema::Result::ScmComponent",
  { component_id => "component_id" },
  { is_deferrable => 1, on_delete => "CASCADE", on_update => "CASCADE" },
);


# Created by DBIx::Class::Schema::Loader v0.07005 @ 2011-01-28 17:11:19
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:CaOj2JuCWOtq0BzOEoyWpA


# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;
