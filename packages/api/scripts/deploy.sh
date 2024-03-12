#!/usr/bin/env bash

CURRENT_DIR="$(pwd -P)"
PARENT_PATH="$(
    cd "$(dirname "${BASH_SOURCE[0]}")" || exit
    pwd -P
)/.."
cd "$PARENT_PATH" || exit

STAGE=$1

. ../../scripts/project-variables.sh
. ../../scripts/get-stack-outputs.sh "$STAGE" >/dev/null
npx serverless deploy --verbose --stage "$STAGE" --region "$REGION"

# check if npx serverless deploy was successful
if [ $? -eq 0 ]; then
    echo "Deploy successful"
else
    echo "Deploy failed"
    cd "$CURRENT_DIR" || exit
    exit 1
fi

cd "$CURRENT_DIR" || exit
