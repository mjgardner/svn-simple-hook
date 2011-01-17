package GSI::Content::Config;

# ABSTRACT: GSI content configuration role

use English '-no_match_vars';
use Moose;
use MooseX::Has::Sugar;
use MooseX::Types::Moose qw(Int Str);
use MooseX::Types::Path::Class 'Dir';
use Path::Class;
use Readonly;
use GSI::Content::Config::Template;
use GSI::Content::Config::Types 'Messages';
with 'MooseX::SimpleConfig';
with 'MooseX::Getopt';

has svn_branch => (
    ro, required,
    isa           => Str,
    traits        => ['Getopt'],
    default       => 'SVN_LTA_SUPPORT',
    documentation => 'Branch name to associate with Subversion locked files',
);

has default_lock_id => (
    ro, required,
    isa           => Int,
    traits        => ['Getopt'],
    default       => 3,
    documentation => 'Default lock status ID for new branches',
);

has messages_dir => (
    ro, required, coerce,
    isa           => Dir,
    traits        => ['Getopt'],
    default       => sub { dir('conf/messages') },
    documentation => 'Directory containing error message templates',
);

has _messages => (
    rw, required, lazy_build,
    isa     => Messages,
    traits  => ['Hash'],
    handles => { message => 'accessor' },
);

sub _build__messages {
    return { map { $ARG => $ARG[0]->_make_template($ARG) }
            @GSI::Content::Config::Types::MESSAGE_TYPES };
}

sub _make_template {
    my ( $self, $template ) = @ARG;
    return GSI::Content::Config::Template->new(
        TYPE => 'FILE',
        SOURCE =>
            file( $self->messages_dir(), "$template.tmpl" )->stringify(),
    );
}

1;

__END__

=head1 DESCRIPTION

L<Moose::Role|Moose::Role> for GSI content configuration information.

=head1 SYNOPSIS

    package MyClass;
    use Moose;
    with 'GSI::Content::Config';

    sub some_method {
        my $self = shift;
        print $self->message('contact');
    }

    1;
