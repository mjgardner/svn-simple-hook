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

  data_type: 'numeric'
  is_auto_increment: 1
  is_nullable: 0
  original: {data_type => "number"}
  sequence: 'user_login_seq'
  size: 126

=cut

__PACKAGE__->add_columns(
  "user_name",
  { data_type => "varchar2", is_nullable => 0, size => 20 },
  "password",
  { data_type => "varchar2", is_nullable => 0, size => 20 },
  "user_type",
  { data_type => "varchar2", is_nullable => 1, size => 20 },
  "id",
  {
    data_type => "numeric",
    is_auto_increment => 1,
    is_nullable => 0,
    original => { data_type => "number" },
    sequence => "user_login_seq",
    size => 126,
  },
);


# Created by DBIx::Class::Schema::Loader v0.07005 @ 2011-01-28 17:11:19
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:FjuvAU67Lci0XgYKPV6TGQ


# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;
