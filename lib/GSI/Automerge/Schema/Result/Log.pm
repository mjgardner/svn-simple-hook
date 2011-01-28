package GSI::Automerge::Schema::Result::Log;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

GSI::Automerge::Schema::Result::Log

=cut

__PACKAGE__->table("logs");

=head1 ACCESSORS

=head2 log_id

  data_type: 'numeric'
  is_auto_increment: 1
  is_nullable: 0
  original: {data_type => "number"}
  sequence: 'log_id_sequence'
  size: 126

=head2 log_timestamp

  data_type: 'timestamp with local time zone'
  is_auto_increment: 1
  is_nullable: 1
  size: 0

=head2 user_name

  data_type: 'varchar2'
  is_nullable: 1
  size: 50

=head2 foreign_id

  data_type: 'numeric'
  is_nullable: 1
  original: {data_type => "number"}
  size: 126

=head2 log_class

  data_type: 'varchar2'
  is_nullable: 1
  size: 80

=head2 comments

  data_type: 'clob'
  is_nullable: 1

=head2 foreign_data

  data_type: 'varchar2'
  is_nullable: 1
  size: 200

=cut

__PACKAGE__->add_columns(
  "log_id",
  {
    data_type => "numeric",
    is_auto_increment => 1,
    is_nullable => 0,
    original => { data_type => "number" },
    sequence => "log_id_sequence",
    size => 126,
  },
  "log_timestamp",
  {
    data_type => "timestamp with local time zone",
    is_auto_increment => 1,
    is_nullable => 1,
    size => 0,
  },
  "user_name",
  { data_type => "varchar2", is_nullable => 1, size => 50 },
  "foreign_id",
  {
    data_type => "numeric",
    is_nullable => 1,
    original => { data_type => "number" },
    size => 126,
  },
  "log_class",
  { data_type => "varchar2", is_nullable => 1, size => 80 },
  "comments",
  { data_type => "clob", is_nullable => 1 },
  "foreign_data",
  { data_type => "varchar2", is_nullable => 1, size => 200 },
);
__PACKAGE__->set_primary_key("log_id");


# Created by DBIx::Class::Schema::Loader v0.07005 @ 2011-01-28 17:11:19
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:MQLdzXxZt4gdDKi+Dic1kQ


# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;
