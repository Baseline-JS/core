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
. ../../scripts/license-status.sh
npx serverless deploy --verbose --stage "$STAGE" --region "$REGION"

# check if npx serverless deploy was successful
if [ $? -eq 0 ]; then
    echo "Deploy successful"
else
    echo "Deploy failed"
    cd "$CURRENT_DIR" || exit
    exit 1
fi

echo "Sending ${STAGE} status to baselinejs.com"
if [ "$STAGE" == "prod" ]; then
    curl -d "{\"licenseId\":\"${LICENSE_ID}\",\"prodStatus\":\"EXISTS\",\"awsAccountId\":\"${AWS_ACCOUNT_ID}\"}" -H "Content-Type: application/json" -X POST https://api.baselinejs.com/license/tracker
else
    curl -d "{\"licenseId\":\"${LICENSE_ID}\",\"stagingStatus\":\"EXISTS\",\"awsAccountId\":\"${AWS_ACCOUNT_ID}\"}" -H "Content-Type: application/json" -X POST https://api.baselinejs.com/license/tracker
fi

cd "$CURRENT_DIR" || exit
