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
  is_nullable: 0
  original: {data_type => "number"}
  size: 126

=head2 log_timestamp

  is_auto_increment: 1

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
    is_nullable => 0,
    original => { data_type => "number" },
    size => 126,
  },
  "log_timestamp",
  { is_auto_increment => 1 },
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


# Created by DBIx::Class::Schema::Loader v0.07002 @ 2010-12-06 13:03:35
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:E4G05clx2Zbk9MGoK0CrsQ


# You can replace this text with custom content, and it will be preserved on regeneration
1;
