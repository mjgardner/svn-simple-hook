package GSI::Automerge::Schema::Result::Message;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

GSI::Automerge::Schema::Result::Message

=cut

__PACKAGE__->table("messages");

=head1 ACCESSORS

=head2 message_id

  data_type: 'numeric'
  is_nullable: 0
  original: {data_type => "number"}
  size: [11,0]

=head2 message

  data_type: 'varchar2'
  is_nullable: 1
  size: 255

=head2 message_type

  data_type: 'varchar2'
  is_nullable: 1
  size: 50

=cut

__PACKAGE__->add_columns(
  "message_id",
  {
    data_type => "numeric",
    is_nullable => 0,
    original => { data_type => "number" },
    size => [11, 0],
  },
  "message",
  { data_type => "varchar2", is_nullable => 1, size => 255 },
  "message_type",
  { data_type => "varchar2", is_nullable => 1, size => 50 },
);
__PACKAGE__->set_primary_key("message_id");

=head1 RELATIONS

=head2 scm_files

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::ScmFile>

=cut

__PACKAGE__->has_many(
  "scm_files",
  "GSI::Automerge::Schema::Result::ScmFile",
  { "foreign.message_id" => "self.message_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);


# Created by DBIx::Class::Schema::Loader v0.07002 @ 2010-09-23 09:58:41
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:P1NqD1zwI3+qfzBd51Cvsw


# You can replace this text with custom content, and it will be preserved on regeneration
1;
