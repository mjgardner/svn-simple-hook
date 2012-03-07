
use strict;
use warnings;

use 5.010;

use ExtUtils::MakeMaker 6.30;



my %WriteMakefileArgs = (
  "ABSTRACT" => "Simple Moose/Mouse-based framework for Subversion hooks",
  "AUTHOR" => "Mark Gardner <mjgardner\@cpan.org>",
  "BUILD_REQUIRES" => {
    "App::Cmd::Tester" => 0,
    "Carp" => 0,
    "Const::Fast" => 0,
    "English" => 0,
    "File::Find" => 0,
    "File::Temp" => 0,
    "Scalar::Util" => 0,
    "Test::More" => "0.94",
    "Test::Most" => 0,
    "Test::Requires" => 0,
    "warnings" => 0
  },
  "CONFIGURE_REQUIRES" => {
    "ExtUtils::MakeMaker" => "6.30"
  },
  "DISTNAME" => "SVN-Simple-Hook",
  "EXE_FILES" => [],
  "LICENSE" => "perl",
  "NAME" => "SVN::Simple::Hook",
  "PREREQ_PM" => {
    "Alien::SVN" => "v1.6.12",
    "Any::Moose" => 0,
    "List::MoreUtils" => 0,
    "Modern::Perl" => 0,
    "MouseX::App::Cmd" => 0,
    "MouseX::Types::Common" => 0,
    "MouseX::Types::Mouse" => 0,
    "MouseX::Types::Path::Class" => 0,
    "Path::Class" => 0,
    "Try::Tiny" => 0,
    "namespace::autoclean" => 0,
    "strict" => 0,
    "utf8" => 0
  },
  "VERSION" => "0.307",
  "test" => {
    "TESTS" => "t/*.t t/regression/*.t"
  }
);


unless ( eval { ExtUtils::MakeMaker->VERSION(6.56) } ) {
  my $br = delete $WriteMakefileArgs{BUILD_REQUIRES};
  my $pp = $WriteMakefileArgs{PREREQ_PM};
  for my $mod ( keys %$br ) {
    if ( exists $pp->{$mod} ) {
      $pp->{$mod} = $br->{$mod} if $br->{$mod} > $pp->{$mod};
    }
    else {
      $pp->{$mod} = $br->{$mod};
    }
  }
}

delete $WriteMakefileArgs{CONFIGURE_REQUIRES}
  unless eval { ExtUtils::MakeMaker->VERSION(6.52) };

WriteMakefile(%WriteMakefileArgs);



