package GSI::Automerge::Schema::Result::Sperrorlog;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

GSI::Automerge::Schema::Result::Sperrorlog

=cut

__PACKAGE__->table("sperrorlog");

=head1 ACCESSORS

=head2 username

  data_type: 'varchar2'
  is_nullable: 1
  size: 256

=head2 timestamp

  data_type: 'timestamp'
  is_nullable: 1

=head2 script

  data_type: 'varchar2'
  is_nullable: 1
  size: 1024

=head2 identifier

  data_type: 'varchar2'
  is_nullable: 1
  size: 256

=head2 message

  data_type: 'clob'
  is_nullable: 1

=head2 statement

  data_type: 'clob'
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "username",
  { data_type => "varchar2", is_nullable => 1, size => 256 },
  "timestamp",
  { data_type => "timestamp", is_nullable => 1 },
  "script",
  { data_type => "varchar2", is_nullable => 1, size => 1024 },
  "identifier",
  { data_type => "varchar2", is_nullable => 1, size => 256 },
  "message",
  { data_type => "clob", is_nullable => 1 },
  "statement",
  { data_type => "clob", is_nullable => 1 },
);


# Created by DBIx::Class::Schema::Loader v0.07005 @ 2011-01-28 17:11:19
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:St3pAsH6wZckfCD3BCn5Rw


# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;
