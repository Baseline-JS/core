#!/usr/bin/env bash
shopt -s failglob
set -eu -o pipefail

CURRENT_DIR="$(pwd -P)"
PARENT_PATH="$(
  cd "$(dirname "${BASH_SOURCE[0]}")" || exit
  pwd -P
)/.."
cd "$PARENT_PATH" || exit

# Move to the component to deploy (api or web)
PACKAGE_PATH="${1:-""}"
cd "$PACKAGE_PATH"

# Install required modules
# pnpm install

if [ "${BITBUCKET_BRANCH:-${GITHUB_REF##*/}}" == "prod" ]; then
  # pnpm run serverless deploy --stage prod --region $AWS_REGION"
  # Downside: this will override the AWS_PROFILE used in the pipeline
  pnpm run deploy:prod
else
  # pnpm run serverless deploy --stage staging --region $AWS_REGION"
  # Downside: this will override the AWS_PROFILE used in the pipeline
  pnpm run deploy:staging
fi

echo "Done!"

cd "$CURRENT_DIR" || exit
