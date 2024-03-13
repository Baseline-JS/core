#!/usr/bin/env bash

CURRENT_DIR="$(pwd -P)"
PARENT_PATH="$(
    cd "$(dirname "${BASH_SOURCE[0]}")" || exit
    pwd -P
)/.."
cd "$PARENT_PATH" || exit

# Sets REGION, APP_NAME, AWS_REGION, AWS_PROFILE
. ../../scripts/project-variables.sh

echo "Testing AWS Keys..."
IAM_RESULT=$(aws sts get-caller-identity --query "Account" --output text --profile "$AWS_PROFILE")
if [ "$IAM_RESULT" ]; then
    echo "AWS Credentials work!"
else
    printf "\033[31mAWS Keys did not work!\033[39m\n"
    exit
fi

# Set the user that will be used for private authorised endpoints - the user that logs in on the client will be ignored.
# AUTHORIZER is a value detected by serverless offline https://github.com/dherault/serverless-offline#remote-authorizers
# This user is and can be linked in local seed data so that there is user specific relationships.
# Restart the API when this is changed.
export AUTHORIZER='{"claims":{"email":"example@devika.com", "sub":"ed805890-d66b-4126-a5d9-0b22e70fce80"}}'

# Required to install/use local DynamoDB
pnpm run install:dynamodb

# Doesn't seem compatible with debug mode
# Provides stack trace using source map so the correct file and line numbers are shown
# export NODE_OPTIONS=--enable-source-maps

# Start the API with serverless
export SLS_DEBUG="*" && node --inspect ./node_modules/serverless/bin/serverless offline start --stage local --region "$REGION" --httpPort 4000 --verbose "$@"

cd "$CURRENT_DIR" || exit
