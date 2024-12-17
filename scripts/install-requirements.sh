#!/bin/bash

install_curl() {
  if command -v curl >/dev/null 2>&1; then
    echo "Curl is already installed."
    return 0
  fi
  echo "Installing curl..."
  if [ $OS == "mac" ]; then
    brew install curl
  else
    if [ -x "$(command -v yum)" ]; then
      sudo yum install -y curl
    elif [ -x "$(command -v apt-get)" ]; then
      sudo apt-get install -y curl
    else
      echo "Package manager not supported. Cannot install curl."
    fi
  fi
}

install_node() {
  if [ -f "$HOME/.nvm/nvm.sh" ]; then
    NVM_EXISTS=true
  else
    NVM_EXISTS=false
  fi
  if $NVM_EXISTS; then
    echo "NVM is already installed."
  else
    echo "Installing NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"                   # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion
  fi
  echo "Setting correct node, npm, and pnpm versions..."
  bash -i -c 'source ~/.bashrc; nvm install 20; nvm use 20; nvm alias default 20; nvm install-latest-npm; npm install -g pnpm@9; exit;'
}

install_aws_cli() {
  if command -v aws >/dev/null 2>&1; then
    echo "AWS CLI is already installed."
    return 0
  fi

  echo "Installing AWS CLI v2..."
  if [ "$OS" == "mac" ]; then
    brew install awscli
    return 0
  fi

  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  unzip awscliv2.zip
  sudo ./aws/install
  rm -rf awscliv2.zip aws
}

install_homebrew() {
  if [ "$OS" != "mac" ]; then
    return 0
  fi

  if command -v brew >/dev/null 2>&1; then
    echo "Homebrew is already installed."
    return 0
  fi
  echo "Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
}

install_jq() {
  if command -v jq >/dev/null 2>&1; then
    echo "jq is already installed."
    return 0
  fi
  case $1 in
  mac)
    brew install jq
    ;;
  linux)
    if [ -x "$(command -v yum)" ]; then
      sudo yum install -y jq
    elif [ -x "$(command -v apt-get)" ]; then
      sudo apt-get install -y jq
    else
      echo "Package manager not supported. Cannot install jq."
    fi
    ;;
  esac
}

install_java() {
  if command -v java >/dev/null 2>&1; then
    # check it isn't just the placeholder java version
    if java -version &>/dev/null; then
      echo "Java is already installed."
      return 0
    else
      echo "Java is not installed. Installing..."
    fi
  fi
  case $1 in
  mac)
    brew install temurin
    ;;
  linux)
    if [ -x "$(command -v yum)" ]; then
      sudo yum install -y java
    elif [ -x "$(command -v apt-get)" ]; then
      sudo apt-get install -y openjdk-8-jdk
    else
      echo "Package manager not supported. Cannot install Java."
    fi
    ;;
  esac
}

# Detect OS and install packages
OS="unknown"
if [ "$(uname)" == "Darwin" ]; then
  OS="mac"
elif [ -f "/etc/redhat-release" ]; then
  OS="linux"
elif [ -f "/etc/debian_version" ]; then
  OS="linux"
fi

usage() {
  echo "Usage: $0 [-f function]"
  echo "Available functions:"
  echo "  all      Install all dependencies"
  echo "  brew     Install Homebrew"
  echo "  curl     Install curl"
  echo "  node     Install Node.js and NVM"
  echo "  aws      Install AWS CLI"
  echo "  jq       Install jq"
  echo "  java     Install Java"
  exit 1
}

while getopts "f:" opt; do
  case ${opt} in
  f)
    FUNCTION=$OPTARG
    ;;
  *)
    usage
    ;;
  esac
done

if [ -z "$FUNCTION" ]; then
  # Default to running all
  FUNCTION="all"
fi

case $FUNCTION in
brew)
  install_homebrew
  ;;
curl)
  install_curl
  ;;
node)
  install_node
  ;;
node-version)
  get_node_version
  ;;
aws)
  install_aws_cli
  ;;
jq)
  install_jq $OS
  ;;
java)
  install_java $OS
  ;;
all)
  install_homebrew
  install_curl
  install_node
  install_aws_cli
  install_jq $OS
  install_java $OS
  echo "Installation complete. Please verify the installation by checking the versions of the installed software."
  echo "Open a new terminal session to start using everything."
  ;;
*)
  usage
  ;;
esac
