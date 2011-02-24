package GSI::SRM::Content::Role::Configurable;

# ABSTRACT: role for config files driving SRM content

use strict;
use Moose::Role;
use MooseX::ConfigFromFile;
use MooseX::Types::Path::Class 'File';
use namespace::autoclean;
with 'MooseX::SimpleConfig';

=attr configfile

Configuration file storing attribute options.
Defaults to F<conf/config.ini>.

=cut

has configfile => (
    %{ MooseX::ConfigFromFile->meta->get_attribute('configfile')
            ->original_options,
        },
    default       => 'conf/config.ini',
    documentation => 'INI configuration file to set options',
);

1;

__END__

=head1 SYNOPSIS

    package My::Package;
    use Moose;
    with 'GSI::SRM::Content::Role::Configurable';

    has my_attr => (
        isa           => 'Str',
        documentation => 'can be set from config file',
    );

    1;

=head1 DESCRIPTION

This is a simple L<Moose|Moose> role that provides default configuration file
behavior driven by L<MooseX::SimpleConfig|MooseX::SimpleConfig>.
