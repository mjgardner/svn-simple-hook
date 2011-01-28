package GSI::Automerge::Schema::Result::Host;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

GSI::Automerge::Schema::Result::Host

=cut

__PACKAGE__->table("host");

=head1 ACCESSORS

=head2 host_id

  is_auto_increment: 1
  is_nullable: 0
  sequence: 'host_id_sequence'

=head2 host_name

  data_type: 'varchar2'
  is_nullable: 0
  size: 4000

=head2 svn_url

  data_type: 'varchar2'
  is_nullable: 1
  size: 4000

=head2 svn_host

  data_type: 'varchar2'
  default_value: 'N'
  is_nullable: 1
  size: 4

=head2 active

  data_type: 'varchar2'
  default_value: 'Y'
  is_nullable: 1
  size: 4

=cut

__PACKAGE__->add_columns(
  "host_id",
  {
    is_auto_increment => 1,
    is_nullable => 0,
    sequence => "host_id_sequence",
  },
  "host_name",
  { data_type => "varchar2", is_nullable => 0, size => 4000 },
  "svn_url",
  { data_type => "varchar2", is_nullable => 1, size => 4000 },
  "svn_host",
  { data_type => "varchar2", default_value => "N", is_nullable => 1, size => 4 },
  "active",
  { data_type => "varchar2", default_value => "Y", is_nullable => 1, size => 4 },
);
__PACKAGE__->set_primary_key("host_id");
__PACKAGE__->add_unique_constraint("host_uk1", ["host_name"]);

=head1 RELATIONS

=head2 environment_admin_hosts

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::Environment>

=cut

__PACKAGE__->has_many(
  "environment_admin_hosts",
  "GSI::Automerge::Schema::Result::Environment",
  { "foreign.admin_host_id" => "self.host_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 environment_hosts

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::Environment>

=cut

__PACKAGE__->has_many(
  "environment_hosts",
  "GSI::Automerge::Schema::Result::Environment",
  { "foreign.host_id" => "self.host_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);


# Created by DBIx::Class::Schema::Loader v0.07002 @ 2010-12-06 13:03:35
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:iGhgYDljtD8+6MlBXXJJiQ
# These lines were loaded from '/usr/local/tools/perl/lib/site_perl/5.10.1/GSI/Automerge/Schema/Result/Host.pm' found in @INC.
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

package GSI::Automerge::Schema::Result::Host;

BEGIN {
    $GSI::Automerge::Schema::Result::Host::VERSION = '1.103400';
}

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';

__PACKAGE__->table("host");

__PACKAGE__->add_columns(
    "host_id",
    {   is_auto_increment => 1,
        is_nullable       => 0,
        sequence          => "host_id_sequence",
    },
    "host_name",
    { data_type => "varchar2", is_nullable => 0, size => 4000 },
    "svn_url",
    { data_type => "varchar2", is_nullable => 1, size => 4000 },
);
__PACKAGE__->set_primary_key("host_id");
__PACKAGE__->add_unique_constraint( "host_uk1", ["host_name"] );

__PACKAGE__->has_many(
    "scm_components",
    "GSI::Automerge::Schema::Result::ScmComponent",
    { "foreign.host_id" => "self.host_id" },
    { cascade_copy      => 0, cascade_delete => 0 },
);

# Created by DBIx::Class::Schema::Loader v0.07002 @ 2010-09-23 09:58:41
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:XaYZd8ghtMTEqk1WnILHEA

# You can replace this text with custom content, and it will be preserved on regeneration
1;

__END__

=pod

=head1 NAME

GSI::Automerge::Schema::Result::Host

=head1 VERSION

version 1.103400

=encoding utf8

=for Pod::Coverage get_class
get_typemap
get_xmlns
START

=head1 NAME

GSI::Automerge::Schema::Result::Host

=head1 ACCESSORS

=head2 host_id

  is_auto_increment: 1
  is_nullable: 0
  sequence: 'host_id_sequence'

=head2 host_name

  data_type: 'varchar2'
  is_nullable: 0
  size: 4000

=head2 svn_url

  data_type: 'varchar2'
  is_nullable: 1
  size: 4000

=head1 RELATIONS

=head2 scm_components

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::ScmComponent>

=head1 AUTHOR

Mark Gardner <gardnerm@gsicommerce.com>

=head1 COPYRIGHT AND LICENSE

This software is copyright (c) 2010 by GSI Commerce.  No
license is granted to other entities.

=cut
# End of lines loaded from '/usr/local/tools/perl/lib/site_perl/5.10.1/GSI/Automerge/Schema/Result/Host.pm' 


# You can replace this text with custom content, and it will be preserved on regeneration
1;
