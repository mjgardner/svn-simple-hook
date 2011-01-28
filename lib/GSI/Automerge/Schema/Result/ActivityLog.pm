package GSI::Automerge::Schema::Result::ActivityLog;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

GSI::Automerge::Schema::Result::ActivityLog

=cut

__PACKAGE__->table("activity_log");

=head1 ACCESSORS

=head2 log_id

  data_type: 'varchar2'
  is_auto_increment: 1
  is_nullable: 0
  sequence: 'activity_log_seq'
  size: 20

=head2 log_entity_name

  data_type: 'varchar2'
  is_nullable: 1
  size: 55

=head2 log_entity_type

  data_type: 'varchar2'
  is_nullable: 1
  size: 20

=head2 activity_time_stamp

  data_type: 'datetime'
  is_nullable: 0
  original: {data_type => "date"}

=head2 activity_status

  data_type: 'varchar2'
  is_nullable: 1
  size: 20

=head2 activity_action

  data_type: 'varchar2'
  is_nullable: 1
  size: 55

=cut

__PACKAGE__->add_columns(
  "log_id",
  {
    data_type => "varchar2",
    is_auto_increment => 1,
    is_nullable => 0,
    sequence => "activity_log_seq",
    size => 20,
  },
  "log_entity_name",
  { data_type => "varchar2", is_nullable => 1, size => 55 },
  "log_entity_type",
  { data_type => "varchar2", is_nullable => 1, size => 20 },
  "activity_time_stamp",
  {
    data_type   => "datetime",
    is_nullable => 0,
    original    => { data_type => "date" },
  },
  "activity_status",
  { data_type => "varchar2", is_nullable => 1, size => 20 },
  "activity_action",
  { data_type => "varchar2", is_nullable => 1, size => 55 },
);
__PACKAGE__->set_primary_key("log_id");


# Created by DBIx::Class::Schema::Loader v0.07005 @ 2011-01-28 17:11:19
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:qd6rGveqg5IvQNcSrZ0MDg


# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;
