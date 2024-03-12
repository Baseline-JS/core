#!/usr/bin/env bash

shopt -s failglob
set -eu -o pipefail

echo "Begin: setup npm"

npm install npm@7.24.2 -g

export NODE_OPTIONS=--max-old-space-size=6144
npm config set user 0
npm config set unsafe-perm true

npm --version

npm install -g pnpm@7

echo "Finish: setup npm"
