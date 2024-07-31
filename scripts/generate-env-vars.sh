#!/usr/bin/env bash

CURRENT_DIR="$(pwd -P)"
PARENT_PATH="$(
    cd "$(dirname "${BASH_SOURCE[0]}")" || exit
    pwd -P
)/.."
cd "$PARENT_PATH" || exit

# Sets REGION, APP_NAME, AWS_REGION, AWS_PROFILE
. ./scripts/project-variables.sh

STACK_STAGE=$1 # local/staging/prod
echo "App Name: [${APP_NAME}]"
echo "Profile: [${AWS_PROFILE}]"
echo "Region: [${REGION}]"
echo "Stack Stage: [${STACK_STAGE}]"

STACK=$STACK_STAGE
if [ "$STACK_STAGE" == "local" ]; then
    STACK="staging"
fi

# Get stack outputs
. ./scripts/get-stack-outputs.sh "${STACK}" >/dev/null

if [ "$STACK_STAGE" == "local" ]; then
    OUTPUT_FILENAME=.env.development
    ServiceEndpoint=http://localhost:4000/local
    if [ "$CODESPACE_NAME" ]; then
        ServiceEndpoint="https://${CODESPACE_NAME}-4000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}/local"
    fi
else
    OUTPUT_FILENAME=.env.production
fi

OUTPUT=$(
    cat <<EOF
REACT_APP_APP_NAME=${APP_NAME:-}
REACT_APP_AWS_PROFILE=${AWS_PROFILE:-}
REACT_APP_API_URL=${ServiceEndpoint:-}/
REACT_APP_COGNITO_IDENTITY_POOL_ID=${IdentityPoolId:-}
REACT_APP_COGNITO_USER_POOL_ID=${UserPoolId:-}
REACT_APP_COGNITO_USER_POOL_WEB_CLIENT_ID=${UserPoolClientId:-}
EOF
)

# Comment below is used to determine where to add new env vars, please do not modify
# Additional variables are set here
echo "$OUTPUT" >./packages/web/$OUTPUT_FILENAME
printf "\033[32m[%s] has been generated successfully!\033[39m\n" "./web/${OUTPUT_FILENAME}"
echo "$OUTPUT" >./packages/admin/$OUTPUT_FILENAME
printf "\033[32m[%s] has been generated successfully!\033[39m\n" "./admin/${OUTPUT_FILENAME}"

cd "$CURRENT_DIR" || exit
