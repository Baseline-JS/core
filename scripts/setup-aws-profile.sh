#!/usr/bin/env bash

CURRENT_DIR="$(pwd -P)"
PARENT_PATH="$(
    cd "$(dirname "${BASH_SOURCE[0]}")" || exit
    pwd -P
)/.."
cd "$PARENT_PATH" || exit

# Sets REGION, APP_NAME, AWS_REGION, AWS_PROFILE
. ./scripts/project-variables.sh

if ! command -v aws &>/dev/null; then
    echo "AWS CLI could not be found, please install it before continuing."
    echo "You can find instructions here: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html"
    exit
fi

printf "Setup AWS profile [\033[32m%s\033[39m]\n" "$AWS_PROFILE"

printf "Enter the AWS Access Key: "
read -r AWS_ACCESS_KEY_ID
printf "Enter the AWS Secret Key: "
read -sr AWS_SECRET_ACCESS_KEY
printf "\nAWS Session Token (optional): "
read -sr AWS_SESSION_TOKEN
printf "\n"

echo "Configuring AWS...."
# If you specify a profile with --profile on an individual command, that overrides the setting specified in the environment variable for only that command.
aws configure set aws_access_key_id "${AWS_ACCESS_KEY_ID:-}" --profile "$AWS_PROFILE"
aws configure set aws_secret_access_key "${AWS_SECRET_ACCESS_KEY:-}" --profile "$AWS_PROFILE"
if [ "$AWS_SESSION_TOKEN" ]; then
    echo "Setting session token"
    aws configure set aws_session_token "${AWS_SESSION_TOKEN:-}" --profile "$AWS_PROFILE"
else
    EXISTING_SESSION=$(aws configure get aws_session_token --profile "$AWS_PROFILE")
    if [ "$EXISTING_SESSION" ]; then
        echo "Existing session token found, removing"
        aws configure set aws_session_token "" --profile "$AWS_PROFILE"
    else
        echo "No existing session token... ignoring"
    fi
fi

echo "Testing AWS Keys..."
IAM_RESULT=$(aws sts get-caller-identity --query "Account" --output text --profile "$AWS_PROFILE")
if [ "$IAM_RESULT" ]; then
    echo "Credentials work!"
else
    echo "AWS Keys did not work!"
fi

echo "Done"

cd "$CURRENT_DIR" || exit
