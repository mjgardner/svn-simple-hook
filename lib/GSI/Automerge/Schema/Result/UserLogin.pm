package GSI::Automerge::Schema::Result::UserLogin;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

GSI::Automerge::Schema::Result::UserLogin

=cut

__PACKAGE__->table("user_login");

=head1 ACCESSORS

=head2 user_name

  data_type: 'varchar2'
  is_nullable: 0
  size: 20

=head2 password

  data_type: 'varchar2'
  is_nullable: 0
  size: 20

=head2 user_type

  data_type: 'varchar2'
  is_nullable: 1
  size: 20

=head2 id

  is_auto_increment: 1
  sequence: 'user_login_seq'

=cut

__PACKAGE__->add_columns(
  "user_name",
  { data_type => "varchar2", is_nullable => 0, size => 20 },
  "password",
  { data_type => "varchar2", is_nullable => 0, size => 20 },
  "user_type",
  { data_type => "varchar2", is_nullable => 1, size => 20 },
  "id",
  { is_auto_increment => 1, sequence => "user_login_seq" },
);


# Created by DBIx::Class::Schema::Loader v0.07002 @ 2010-10-08 12:54:22
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:MrOw2wLTZbuWhghS2D4Fjg


# You can replace this text with custom content, and it will be preserved on regeneration
1;
