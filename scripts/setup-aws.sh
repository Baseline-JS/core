#!/usr/bin/env bash

shopt -s failglob
set -eu -o pipefail

CURRENT_DIR="$(pwd -P)"
PARENT_PATH="$(
  cd "$(dirname "${BASH_SOURCE[0]}")" || exit
  pwd -P
)/.."
cd "$PARENT_PATH" || exit

echo "Begin: Setup AWS"

# Only install AWS CLI if deployed from Bitbucket
if [ "${BITBUCKET_BRANCH:-}" ]; then
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  unzip -qq awscliv2.zip
  ./aws/install -i /usr/local/aws-cli -b /usr/local/bin
fi

# Sets REGION, APP_NAME, AWS_REGION, AWS_PROFILE
. ./scripts/project-variables.sh

echo "App Name: [$APP_NAME]"
echo "Profile: [$AWS_PROFILE]"
echo "Region: [$AWS_REGION]"

export AWS_HOME="/usr/local/bin/aws"
export PATH="${AWS_HOME:-}:$PATH"

# Todo: Allow access keys for other pipeline environments
# if [ "$AWS_ACCESS_KEY_ID" == "" ] || [ "$AWS_SECRET_ACCESS_KEY" == "" ]; then
#   # These can be used if master and prod are in different accounts or the IAM roles have different access
#   if [ "$BITBUCKET_BRANCH" == "prod" ]; then
#     export AWS_ACCESS_KEY_ID="${PROD_AWS_ACCOUNT_ACCESS_KEY_ID}"
#     export AWS_SECRET_ACCESS_KEY="${PROD_AWS_ACCOUNT_SECRET_ACCESS_KEY}"
#   else
#     export AWS_ACCESS_KEY_ID="${NON_AWS_ACCOUNT_ACCESS_KEY_ID}"
#     export AWS_SECRET_ACCESS_KEY="${NON_AWS_ACCOUNT_SECRET_ACCESS_KEY}"
#   fi
# fi

# if [ "$AWS_ACCESS_KEY_ID" == "" ] || [ "$AWS_SECRET_ACCESS_KEY" == "" ]; then
#   echo "Warning: No AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY provided."
#   echo "You will not be able to deploy some of the AWS components of the environment."
# fi

# Todo: Allow access keys for other pipeline environments
# aws configure set aws_access_key_id "${AWS_ACCESS_KEY_ID:-}"
# aws configure set aws_secret_access_key "${AWS_SECRET_ACCESS_KEY:-}"

# https://support.atlassian.com/bitbucket-cloud/docs/deploy-on-aws-using-bitbucket-pipelines-openid-connect/
export AWS_WEB_IDENTITY_TOKEN_FILE="$CURRENT_DIR/web-identity-token"
echo "$BITBUCKET_STEP_OIDC_TOKEN" >"$AWS_WEB_IDENTITY_TOKEN_FILE"

aws --version
aws configure set cli_follow_urlparam false
aws configure set region "${AWS_REGION:-}"
aws configure set region "${AWS_REGION:-}" --profile "$AWS_PROFILE"
# https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-role.html
aws configure set role_arn "${AWS_ROLE_ARN:-}" --profile "$AWS_PROFILE"
aws configure set web_identity_token_file "${AWS_WEB_IDENTITY_TOKEN_FILE:-}" --profile "$AWS_PROFILE"

echo "Current AWS Account:"
aws sts get-caller-identity --query "Account" --output text --profile "$AWS_PROFILE"

# https://docs.aws.amazon.com/cli/latest/reference/sts/assume-role-with-web-identity.html
TOKEN_JSON="$(
  aws sts assume-role-with-web-identity \
    --duration-seconds 3600 \
    --role-session-name "baseline-core-deploy" \
    --role-arn "$AWS_ROLE_ARN" \
    --web-identity-token "$BITBUCKET_STEP_OIDC_TOKEN"
)"

ACCESS_KEY_ID="$(echo "${TOKEN_JSON}" | jq '.Credentials.AccessKeyId' -r)"
SECRET_ACCESS_KEY="$(echo "${TOKEN_JSON}" | jq '.Credentials.SecretAccessKey' -r)"
SESSION_TOKEN="$(echo "${TOKEN_JSON}" | jq '.Credentials.SessionToken' -r)"

aws configure set aws_access_key_id "${ACCESS_KEY_ID:-}" --profile "$AWS_PROFILE"
aws configure set aws_secret_access_key "${SECRET_ACCESS_KEY:-}" --profile "$AWS_PROFILE"
aws configure set aws_session_token "${SESSION_TOKEN:-}" --profile "$AWS_PROFILE"

echo "Current AWS Account:"
aws sts get-caller-identity --query "Account" --output text --profile "$AWS_PROFILE"

echo "Finish: Setup AWS"

cd "$CURRENT_DIR" || exit
