package GSI::Automerge::Schema::Result::JobStatusCd;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';


=head1 NAME

GSI::Automerge::Schema::Result::JobStatusCd

=cut

__PACKAGE__->table("job_status_cd");

=head1 ACCESSORS

=head2 job_status_id

  data_type: 'numeric'
  is_auto_increment: 1
  is_nullable: 0
  original: {data_type => "number"}
  sequence: 'job_status_seq'
  size: 126

=head2 job_status_value

  data_type: 'varchar2'
  is_nullable: 1
  size: 20

=head2 job_status_cd

  data_type: 'varchar2'
  is_nullable: 1
  size: 20

=cut

__PACKAGE__->add_columns(
  "job_status_id",
  {
    data_type => "numeric",
    is_auto_increment => 1,
    is_nullable => 0,
    original => { data_type => "number" },
    sequence => "job_status_seq",
    size => 126,
  },
  "job_status_value",
  { data_type => "varchar2", is_nullable => 1, size => 20 },
  "job_status_cd",
  { data_type => "varchar2", is_nullable => 1, size => 20 },
);
__PACKAGE__->set_primary_key("job_status_id");

=head1 RELATIONS

=head2 automerge_logs

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::AutomergeLog>

=cut

__PACKAGE__->has_many(
  "automerge_logs",
  "GSI::Automerge::Schema::Result::AutomergeLog",
  { "foreign.merge_job_status" => "self.job_status_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 merge_jobs

Type: has_many

Related object: L<GSI::Automerge::Schema::Result::MergeJob>

=cut

__PACKAGE__->has_many(
  "merge_jobs",
  "GSI::Automerge::Schema::Result::MergeJob",
  { "foreign.job_status_id" => "self.job_status_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);


# Created by DBIx::Class::Schema::Loader v0.07005 @ 2011-01-28 17:11:19
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:L3W6QSLmOfsBxTkxUGVA6w


# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;
