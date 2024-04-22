#!/usr/bin/env bash

shopt -s failglob
set -eu -o pipefail

echo "Begin: setup npm"

npm install npm@10.5.0 -g

export NODE_OPTIONS=--max-old-space-size=6144
npm config set user 0
npm config set unsafe-perm true

npm --version

npm install -g pnpm@9

echo "Finish: setup npm"
