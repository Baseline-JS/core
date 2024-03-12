#!/usr/bin/env bash

CURRENT_DIR="$(pwd -P)"
PARENT_PATH="$(
    cd "$(dirname "${BASH_SOURCE[0]}")" || exit
    pwd -P
)/.."
cd "$PARENT_PATH" || exit

if [ "$LICENSE_ID" == "" ]; then
    echo "No Baseline license ID found! Please check your Baseline License Tracker is in your AWS account and try again."
    exit 1
fi

RESPONSE=$(curl -s -X GET \
    "https://api.baselinejs.com/license/status?licenseId=${LICENSE_ID:-}&awsAccountId=${AWS_ACCOUNT_ID:-}" \
    -H "accept: application/json")

if [ "${RESPONSE:0:1}" != "{" ]; then
    echo "LICENSE CHECK FAILED: Response is not JSON"
    STATUS="FAILED"
elif [ "$(echo "$RESPONSE" | jq -r '.error')" != "null" ]; then
    echo LICENSE CHECK FAILED: "$(echo "$RESPONSE" | jq -r '.error')"
    STATUS="FAILED"
else
    STATUS=$(echo "$RESPONSE" | jq -r '.status')
fi

if [ "$STATUS" == "ACTIVE" ]; then
    printf "\e[32mBASELINE LICENSE STATUS: %s\e[0m\n" "${STATUS}"
else
    printf "\e[31mBASELINE LICENSE STATUS: %s\e[0m\n" "${STATUS}"
fi

cd "$CURRENT_DIR" || exit
