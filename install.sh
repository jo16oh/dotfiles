#!/bin/bash

PROJECT_DIR=$(dirname "$0")

# Install Homebrew
if ! command -v brew &> /dev/null; then
  echo "Homebrew is not installed. Installing..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  echo
else
  echo "Homebrew is already installed."
fi

# Install command line tools and applications
brew bundle --file=$PROJECT_DIR/Brewfile
echo

# Create simlinks
stow -v -R --dotfiles -d $PROJECT_DIR -t ~ config
echo

# Install devtools
mise install
echo
