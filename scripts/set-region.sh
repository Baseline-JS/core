#!/usr/bin/env bash

CURRENT_DIR="$(pwd -P)"
PARENT_PATH="$( cd "$(dirname "${BASH_SOURCE[0]}")" || exit ; pwd -P )/.."
cd "$PARENT_PATH" || exit

echo "Changing region to [$1]"

sed -i '' -e "s|ap-southeast-2|$1|g" ./scripts/project-variables.sh

cd "$CURRENT_DIR" || exit
