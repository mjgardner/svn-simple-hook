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
  is_nullable: 0
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
  { data_type => "varchar2", is_nullable => 0, size => 20 },
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


# Created by DBIx::Class::Schema::Loader v0.07002 @ 2010-09-23 09:58:41
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:HzHHDOVpLRMaIDKQuyj9wA


# You can replace this text with custom content, and it will be preserved on regeneration
1;
