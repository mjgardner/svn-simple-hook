package GSI::Automerge::Schema::Result::SvnUserPerm;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

GSI::Automerge::Schema::Result::SvnUserPerm

=cut

__PACKAGE__->table("svn_user_perm");

=head1 ACCESSORS

=head2 svn_perm_id

  is_auto_increment: 1
  is_nullable: 0
  sequence: 'svn_perm_id_sequence'

=head2 component_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: 126

=head2 perm_def_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: 126

=head2 svn_url

  data_type: 'varchar2'
  is_nullable: 1
  size: 4000

=head2 exp_date

  data_type: 'datetime'
  is_nullable: 1
  original: {data_type => "date"}

=head2 comments

  data_type: 'clob'
  is_nullable: 1

=head2 group_name

  data_type: 'varchar2'
  is_nullable: 1
  size: 255

=head2 user_name

  data_type: 'varchar2'
  is_nullable: 1
  size: 255

=cut

__PACKAGE__->add_columns(
  "svn_perm_id",
  {
    is_auto_increment => 1,
    is_nullable => 0,
    sequence => "svn_perm_id_sequence",
  },
  "component_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => 126,
  },
  "perm_def_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => 126,
  },
  "svn_url",
  { data_type => "varchar2", is_nullable => 1, size => 4000 },
  "exp_date",
  {
    data_type   => "datetime",
    is_nullable => 1,
    original    => { data_type => "date" },
  },
  "comments",
  { data_type => "clob", is_nullable => 1 },
  "group_name",
  { data_type => "varchar2", is_nullable => 1, size => 255 },
  "user_name",
  { data_type => "varchar2", is_nullable => 1, size => 255 },
);
__PACKAGE__->set_primary_key("svn_perm_id");
__PACKAGE__->add_unique_constraint(
  "svn_user_perm_uk1",
  ["component_id", "svn_url", "exp_date", "group_name", "user_name"],
);

=head1 RELATIONS

=head2 component

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::ScmComponent>

=cut

__PACKAGE__->belongs_to(
  "component",
  "GSI::Automerge::Schema::Result::ScmComponent",
  { component_id => "component_id" },
  {
    is_deferrable => 1,
    join_type     => "LEFT",
    on_delete     => "CASCADE",
    on_update     => "CASCADE",
  },
);

=head2 perm_def

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::PermissionDefinition>

=cut

__PACKAGE__->belongs_to(
  "perm_def",
  "GSI::Automerge::Schema::Result::PermissionDefinition",
  { perm_def_id => "perm_def_id" },
  {
    is_deferrable => 1,
    join_type     => "LEFT",
    on_delete     => "CASCADE",
    on_update     => "CASCADE",
  },
);


# Created by DBIx::Class::Schema::Loader v0.07002 @ 2010-10-08 12:54:22
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:Gu5p219tdXQgGcMRC1eEUg
# These lines were loaded from '/usr/local/lib/perl5/site_perl/5.12.2/GSI/Automerge/Schema/Result/SvnUserPerm.pm' found in @INC.
# They are now part of the custom portion of this file
# for you to hand-edit.  If you do not either delete
# this section or remove that file from @INC, this section
# will be repeated redundantly when you re-create this
# file again via Loader!  See skip_load_external to disable
# this feature.

#
# This file is part of GSI-SVN-Crowd
#
# This software is copyright (c) 2010 by GSI Commerce.  No
# license is granted to other entities.
#
use 5.008_008;    ## no critic (RequireExplicitPackage)
use utf8;         ## no critic (RequireExplicitPackage)
use strict;       ## no critic (RequireExplicitPackage)
use warnings;     ## no critic (RequireExplicitPackage)

package GSI::Automerge::Schema::Result::SvnUserPerm;

BEGIN {
    $GSI::Automerge::Schema::Result::SvnUserPerm::VERSION = '1.102678';
}

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';

__PACKAGE__->table("svn_user_perm");

__PACKAGE__->add_columns(
    "svn_perm_id",
    { is_auto_increment => 1, sequence => "svn_perm_id_sequence" },
    "component_id",
    {   data_type      => "numeric",
        is_foreign_key => 1,
        is_nullable    => 1,
        original       => { data_type => "number" },
        size           => [ 10, 0 ],
    },
    "perm_def_id",
    {   data_type      => "numeric",
        is_foreign_key => 1,
        is_nullable    => 0,
        original       => { data_type => "number" },
        size           => [ 10, 0 ],
    },
    "svn_url",
    { data_type => "varchar2", is_nullable => 1, size => 4000 },
    "exp_date",
    {   data_type   => "datetime",
        is_nullable => 1,
        original    => { data_type => "date" },
    },
    "comments",
    { data_type => "clob", is_nullable => 1 },
    "group_name",
    { data_type => "varchar2", is_nullable => 1, size => 30 },
    "user_name",
    { data_type => "varchar2", is_nullable => 1, size => 30 },
);
__PACKAGE__->add_unique_constraint( "svn_user_perm_uk1",
    [ "component_id", "svn_url", "user_name", "group_name" ],
);

__PACKAGE__->belongs_to(
    "component",
    "GSI::Automerge::Schema::Result::ScmComponent",
    { component_id => "component_id" },
    {   is_deferrable => 1,
        join_type     => "LEFT",
        on_delete     => "CASCADE",
        on_update     => "CASCADE",
    },
);

__PACKAGE__->belongs_to(
    "perm_def",
    "GSI::Automerge::Schema::Result::PermissionDefinition",
    { perm_def_id   => "perm_def_id" },
    { is_deferrable => 1, on_delete => "CASCADE", on_update => "CASCADE" },
);

# Created by DBIx::Class::Schema::Loader v0.07002 @ 2010-09-23 09:58:42
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:gTt0MRInnDSwVrcmW+2Lzg

# You can replace this text with custom content, and it will be preserved on regeneration
1;

__END__

=pod

=head1 NAME

GSI::Automerge::Schema::Result::SvnUserPerm

=head1 VERSION

version 1.102678

=for Pod::Coverage get_class
get_typemap
get_xmlns
START

=head1 NAME

GSI::Automerge::Schema::Result::SvnUserPerm

=head1 ACCESSORS

=head2 svn_perm_id

  is_auto_increment: 1
  sequence: 'svn_perm_id_sequence'

=head2 component_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: [10,0]

=head2 perm_def_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 0
  original: {data_type => "number"}
  size: [10,0]

=head2 svn_url

  data_type: 'varchar2'
  is_nullable: 1
  size: 4000

=head2 exp_date

  data_type: 'datetime'
  is_nullable: 1
  original: {data_type => "date"}

=head2 comments

  data_type: 'clob'
  is_nullable: 1

=head2 group_name

  data_type: 'varchar2'
  is_nullable: 1
  size: 30

=head2 user_name

  data_type: 'varchar2'
  is_nullable: 1
  size: 30

=head1 RELATIONS

=head2 component

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::ScmComponent>

=head2 perm_def

Type: belongs_to

Related object: L<GSI::Automerge::Schema::Result::PermissionDefinition>

=head1 AUTHOR

Mark Gardner <gardnerm@gsicommerce.com>

=head1 COPYRIGHT AND LICENSE

This software is copyright (c) 2010 by GSI Commerce.  No
license is granted to other entities.

=cut
# End of lines loaded from '/usr/local/lib/perl5/site_perl/5.12.2/GSI/Automerge/Schema/Result/SvnUserPerm.pm' 


# You can replace this text with custom content, and it will be preserved on regeneration
1;
