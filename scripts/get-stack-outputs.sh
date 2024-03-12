#!/usr/bin/env bash
# shellcheck disable=SC2207

CURRENT_DIR="$(pwd -P)"
PARENT_PATH="$(
  cd "$(dirname "${BASH_SOURCE[0]}")" || exit
  pwd -P
)/.."
cd "$PARENT_PATH" || exit

# Sets REGION, APP_NAME, AWS_REGION, AWS_PROFILE
. ./scripts/project-variables.sh

STAGE=$1

echo "Begin: exporting cloudformation outputs as environment variables"
start=$(date +%s)

echo "App Name: [${APP_NAME}]"
echo "Profile: [${AWS_PROFILE}]"
echo "Region: [${REGION}]"
echo "Stage: [${STAGE}]"

if [ "$AWS_PROFILE" == "" ] || [ "$STAGE" == "" ] || [ "$REGION" == "" ]; then
  echo "Error: No profile, stage or region passed"
  exit 1
fi

IS_STACK="$(aws cloudformation describe-stacks --region "${REGION}" --profile "${AWS_PROFILE}" --max-items 1 >/dev/null)"
if ! $IS_STACK; then
  echo "No stacks found in region, nothing to export"
elif [[ "$(aws cloudformation describe-stacks --region "${REGION}" --profile "${AWS_PROFILE}" --max-items 1 --query "Stacks[]")" == "[]" ]]; then
  echo "Empty set of stacks found, nothing to export"
else
  stacksForRegion=$(aws cloudformation describe-stacks --region "${REGION}")

  echo "Env Stack filter: [$APP_NAME] && [$STAGE]"

  stacksForEnvFilter="$(echo "${stacksForRegion:-}" | grep "StackName" | { grep -i "$APP_NAME" | grep -i "$STAGE" || true; })"

  if [ "${stacksForEnvFilter:-}" != "" ]; then
    stacksForEnv="$(echo "${stacksForEnvFilter:-}" | cut -d\" -f4)"

    if [ "${stacksForEnv:-}" != "" ]; then
      for stack in $stacksForEnv; do
        echo
        echo "Outputs for: $stack"
        echo
        stack_info=$(aws cloudformation describe-stacks \
          --region "$REGION" \
          --stack-name "$stack" \
          --profile "${AWS_PROFILE}" \
          --output json)

        if [[ "$stack_info" =~ "OutputKey" ]]; then
          outputKeys=($(echo "$stack_info" | jq ".Stacks[].Outputs[].OutputKey"))
          outputValues=($(echo "$stack_info" | jq ".Stacks[].Outputs[].OutputValue"))

          for ((i = 0; i < ${#outputKeys[@]}; i++)); do
            keyTmp=${outputKeys[i]#\"*}
            key=${keyTmp%\"*}
            valTmp=${outputValues[i]#\"*}
            val=${valTmp%\"*}
            echo "export $key=$val"
            export "$key"="$val"
          done
        fi
      done
    else
      echo "No stacks found for environment filter, nothing to export"
    fi
  else
    echo "No stacks found for environment filter, nothing to export"
  fi
fi

AWS_ACCOUNT_ID="$(aws sts get-caller-identity --profile "$AWS_PROFILE" --region us-east-1 --output text --query 'Account')"
export AWS_ACCOUNT_ID

echo AWS_ACCOUNT_ID="$AWS_ACCOUNT_ID"

end=$(date +%s)
runtime=$((end - start))
echo "Finish ($runtime secs): exporting cloudformation outputs as environment variables"

cd "$CURRENT_DIR" || exit
