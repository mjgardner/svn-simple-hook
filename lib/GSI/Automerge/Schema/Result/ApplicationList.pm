package GSI::Automerge::Schema::Result::ApplicationList;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

GSI::Automerge::Schema::Result::ApplicationList

=cut

__PACKAGE__->table("application_list");

=head1 ACCESSORS

=head2 application_id

  data_type: 'numeric'
  is_nullable: 0
  original: {data_type => "number"}
  size: [11,0]

=head2 application_name

  data_type: 'varchar2'
  is_nullable: 0
  size: 150

=head2 svn_url

  data_type: 'varchar2'
  is_nullable: 1
  size: 1000

=head2 maven_path

  data_type: 'varchar2'
  is_nullable: 1
  size: 1000

=head2 active

  data_type: 'varchar2'
  default_value: 'Y'
  is_nullable: 1
  size: 2

=head2 component_id

  data_type: 'numeric'
  is_foreign_key: 1
  is_nullable: 1
  original: {data_type => "number"}
  size: 126

=cut

__PACKAGE__->add_columns(
  "application_id",
  {
    data_type => "numeric",
    is_nullable => 0,
    original => { data_type => "number" },
    size => [11, 0],
  },
  "application_name",
  { data_type => "varchar2", is_nullable => 0, size => 150 },
  "svn_url",
  { data_type => "varchar2", is_nullable => 1, size => 1000 },
  "maven_path",
  { data_type => "varchar2", is_nullable => 1, size => 1000 },
  "active",
  { data_type => "varchar2", default_value => "Y", is_nullable => 1, size => 2 },
  "component_id",
  {
    data_type => "numeric",
    is_foreign_key => 1,
    is_nullable => 1,
    original => { data_type => "number" },
    size => 126,
  },
);
__PACKAGE__->set_primary_key("application_id");
__PACKAGE__->add_unique_constraint("application_list_app_name", ["application_name"]);

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

=head2 project_lists

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::ProjectList>

=cut

__PACKAGE__->has_many(
  "project_lists",
  "GSI::Automerge::Schema::Result::ProjectList",
  { "foreign.application_id" => "self.application_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);


# Created by DBIx::Class::Schema::Loader v0.07002 @ 2010-12-06 13:03:35
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:Ilcvaknbe0Z6ngki83j95A
# These lines were loaded from '/usr/local/tools/perl/lib/site_perl/5.10.1/GSI/Automerge/Schema/Result/ApplicationList.pm' found in @INC.
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
use 5.010;       ## no critic (RequireExplicitPackage)
use utf8;        ## no critic (RequireExplicitPackage)
use strict;      ## no critic (RequireExplicitPackage)
use warnings;    ## no critic (RequireExplicitPackage)

package GSI::Automerge::Schema::Result::ApplicationList;

BEGIN {
    $GSI::Automerge::Schema::Result::ApplicationList::VERSION = '1.103400';
}

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';

__PACKAGE__->table("application_list");

__PACKAGE__->add_columns(
    "application_id",
    {   data_type   => "numeric",
        is_nullable => 0,
        original    => { data_type => "number" },
        size        => [ 11, 0 ],
    },
    "application_name",
    { data_type => "varchar2", is_nullable => 0, size => 150 },
    "svn_url",
    { data_type => "varchar2", is_nullable => 1, size => 1000 },
    "maven_path",
    { data_type => "varchar2", is_nullable => 1, size => 1000 },
    "active",
    {   data_type     => "varchar2",
        default_value => "Y",
        is_nullable   => 1,
        size          => 2
    },
);
__PACKAGE__->set_primary_key("application_id");
__PACKAGE__->add_unique_constraint( "application_list_app_name",
    ["application_name"] );

__PACKAGE__->has_many(
    "project_lists",
    "GSI::Automerge::Schema::Result::ProjectList",
    { "foreign.application_id" => "self.application_id" },
    { cascade_copy             => 0, cascade_delete => 0 },
);

# Created by DBIx::Class::Schema::Loader v0.07002 @ 2010-10-08 12:54:21
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:CNr/t07awJbO23chDyHeiQ

# You can replace this text with custom content, and it will be preserved on regeneration
1;

__END__

=pod

=head1 NAME

GSI::Automerge::Schema::Result::ApplicationList

=head1 VERSION

version 1.103400

=encoding utf8

=for Pod::Coverage get_class
get_typemap
get_xmlns
START

=head1 NAME

GSI::Automerge::Schema::Result::ApplicationList

=head1 ACCESSORS

=head2 application_id

  data_type: 'numeric'
  is_nullable: 0
  original: {data_type => "number"}
  size: [11,0]

=head2 application_name

  data_type: 'varchar2'
  is_nullable: 0
  size: 150

=head2 svn_url

  data_type: 'varchar2'
  is_nullable: 1
  size: 1000

=head2 maven_path

  data_type: 'varchar2'
  is_nullable: 1
  size: 1000

=head2 active

  data_type: 'varchar2'
  default_value: 'Y'
  is_nullable: 1
  size: 2

=head1 RELATIONS

=head2 project_lists

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::ProjectList>

=head1 AUTHOR

Mark Gardner <gardnerm@gsicommerce.com>

=head1 COPYRIGHT AND LICENSE

This software is copyright (c) 2010 by GSI Commerce.  No
license is granted to other entities.

=cut
# End of lines loaded from '/usr/local/tools/perl/lib/site_perl/5.10.1/GSI/Automerge/Schema/Result/ApplicationList.pm' 


# You can replace this text with custom content, and it will be preserved on regeneration
1;
