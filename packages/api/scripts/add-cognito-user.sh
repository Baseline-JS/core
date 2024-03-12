#!/usr/bin/env bash

shopt -s failglob

CURRENT_DIR="$(pwd -P)"
PARENT_PATH="$(
  cd "$(dirname "${BASH_SOURCE[0]}")" || exit
  pwd -P
)/.."
cd "$PARENT_PATH" || exit

STAGE=$1

# Sets REGION, APP_NAME, AWS_REGION, AWS_PROFILE
. ../../scripts/project-variables.sh

TABLE="admin-${APP_NAME}-${STAGE}"

echo "Getting Cognito User Pool Id from [$STAGE]..."
. ../../scripts/get-stack-outputs.sh "$STAGE" >/dev/null
COGNITO_USER_POOL_ID="${UserPoolId:-}"
if [ "$COGNITO_USER_POOL_ID" == "" ]; then
  echo "Failed to get Cognito User Pool Id!"
  echo 'Check your aws credentials are up to date, maybe run "npm run aws:profile"'
  exit 1
else
  echo "Cognito Pool Id [$COGNITO_USER_POOL_ID]"
fi

printf "Email: "
read -r USER_EMAIL

printf "Password: "
read -sr USER_PASSWORD
echo ""

if [ "$USER_PASSWORD" == "" ]; then
  echo "Error: No user password set"
  exit 1
fi

EXISTING_USER=$(aws cognito-idp admin-get-user \
  --profile "${AWS_PROFILE}" \
  --region "${REGION}" \
  --user-pool-id "${COGNITO_USER_POOL_ID:-}" \
  --username "${USER_EMAIL}")

if [ "$EXISTING_USER" ]; then
  echo "User already exists, will not modify password"
  echo "Will attempt to add to DynamoDB"
else
  echo "Creating User..."

  aws cognito-idp admin-create-user \
    --profile "${AWS_PROFILE}" \
    --region "${REGION}" \
    --user-pool-id "${COGNITO_USER_POOL_ID:-}" \
    --username "${USER_EMAIL:-}" \
    --user-attributes Name=email,Value="${USER_EMAIL:-}" Name=email_verified,Value=true \
    --message-action SUPPRESS >/dev/null

  echo "Setting Password..."
  aws cognito-idp admin-set-user-password \
    --profile "${AWS_PROFILE}" \
    --region "${REGION}" \
    --user-pool-id "${COGNITO_USER_POOL_ID:-}" \
    --username "${USER_EMAIL:-}" \
    --password "${USER_PASSWORD:-}" \
    --permanent >/dev/null
fi

USER_SUB=$(aws cognito-idp admin-get-user \
  --profile "${AWS_PROFILE}" \
  --region "${REGION}" \
  --user-pool-id "${COGNITO_USER_POOL_ID:-}" \
  --username "${USER_EMAIL}" |
  jq '.["Username"]' |
  tr -d '"')

echo "User Sub: [${USER_SUB}]"

if [ "$USER_SUB" ]; then
  echo "Found user sub, attempting to create DynamoDB record"
  aws dynamodb put-item \
    --table-name "${TABLE}" \
    --item \
    "{\"userSub\": {\"S\": \"${USER_SUB}\"}, \"userEmail\": {\"S\": \"${USER_EMAIL}\"}}" \
    --profile "${AWS_PROFILE}" \
    --region "${REGION}"
else
  echo "User sub not found, cannot create DynamoDB record"
fi

echo "Done!"

cd "$CURRENT_DIR" || exit
