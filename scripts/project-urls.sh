#!/usr/bin/env bash

CURRENT_DIR="$(pwd -P)"
PARENT_PATH="$(
    cd "$(dirname "${BASH_SOURCE[0]}")" || exit
    pwd -P
)/.."
cd "$PARENT_PATH" || exit

echo "Stage [$1]"

. ./scripts/get-stack-outputs.sh $1 >/dev/null

echo "Web: https://${WebCloudFrontUrl:-}"
echo "Admin: https://${AdminCloudFrontUrl:-}"
echo "API: ${ServiceEndpoint:-}"

cd "$CURRENT_DIR" || exit
