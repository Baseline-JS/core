#!/usr/bin/env bash

CURRENT_DIR="$(pwd -P)"
PARENT_PATH="$(
    cd "$(dirname "${BASH_SOURCE[0]}")" || exit
    pwd -P
)/.."
cd "$PARENT_PATH" || exit

STAGE=$1

pnpm run generate:env:"$STAGE"
. ../../scripts/project-variables.sh
. ../../scripts/get-stack-outputs.sh "$STAGE" >/dev/null
pnpm run build:deploy
npx serverless deploy --verbose --stage "$STAGE" --region "$REGION"

cd "$CURRENT_DIR" || exit
