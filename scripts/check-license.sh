#!/usr/bin/env bash

. ./scripts/project-variables.sh

LICENSE_ID="$(aws lambda list-functions --profile "$AWS_PROFILE" --region us-east-1 --output text --query 'Functions[].[FunctionArn]' | grep BaselineScheduledLambda | xargs -I {} aws lambda list-tags --profile "$AWS_PROFILE" --region us-east-1 --resource {} --query '{"{}":Tags}' | jq -r '.[] | .LicenseId')"
export LICENSE_ID
AWS_ACCOUNT_ID="$(aws sts get-caller-identity --profile "$AWS_PROFILE" --region us-east-1 --output text --query 'Account')"
export AWS_ACCOUNT_ID

./scripts/license-status.sh
