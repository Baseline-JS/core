#!/usr/bin/env bash

# Sets REGION, APP_NAME, AWS_REGION, AWS_PROFILE
. ./scripts/project-variables.sh

STAGE="${1:-"local"}"

echo "App Name: [${APP_NAME}]"
echo "Profile: [${AWS_PROFILE}]"
echo "Region: [${REGION}]"
echo "Stage: [${STAGE}]"

echo "Create new environment variable for stage [$STAGE]"

PARAMETER_TYPE=""
ENV_LOCATION="backend"

printf 'Used in Frontend or Backend (f/B)? '
old_stty_cfg=$(stty -g)
stty raw -echo
answer=$(head -c 1)
stty "$old_stty_cfg"
if echo "$answer" | grep -iq "^f"; then
  echo Frontend
  PARAMETER_TYPE="String"
  ENV_LOCATION="frontend"
else
  echo Backend
fi

printf "Enter new variable name (in CAPS): "
read -r NAME

if [ ! $PARAMETER_TYPE ]; then
  printf 'Is it secret (y/n)? '
  old_stty_cfg=$(stty -g)
  stty raw -echo
  answer=$(head -c 1)
  stty "$old_stty_cfg"
  if echo "$answer" | grep -iq "^y"; then
    echo Yes
    PARAMETER_TYPE="SecureString"
    printf "Enter new value: "
    while IFS= read -p "$prompt" -r -s -n 1 char; do
      if [[ $char == $'\0' ]]; then
        break
      fi
      prompt='*'
      VALUE+="$char"
    done
    echo
  else
    echo No
    PARAMETER_TYPE="String"
    printf "Enter new value: "
    read -r VALUE
  fi
else
  echo "Frontend env vars are never secret, using plaintext."
  printf "Enter new value: "
  read -r VALUE
fi

echo "Checking AWS SSM for existing record..."
if ! aws ssm get-parameter --name "/$APP_NAME/$STAGE/$NAME" --profile "$AWS_PROFILE" --region "$REGION" >/dev/null; then
  echo "No existing record"
  echo "Pushing to AWS SSM..."
  aws ssm put-parameter --name "/$APP_NAME/$STAGE/$NAME" \
    --value "$VALUE" --type $PARAMETER_TYPE --overwrite --profile "$AWS_PROFILE" --region "$REGION" >/dev/null
  echo "done"
else
  aws ssm get-parameter --name "/$APP_NAME/$STAGE/$NAME" --profile "$AWS_PROFILE" --region "$REGION"
  printf 'Existing record, do you want to update? (y/n)? '
  old_stty_cfg=$(stty -g)
  stty raw -echo
  answer=$(head -c 1)
  stty "$old_stty_cfg"
  if echo "$answer" | grep -iq "^y"; then
    echo Yes
    echo "Pushing to AWS SSM..."
    aws ssm put-parameter --name "/$APP_NAME/$STAGE/$NAME" \
      --value "$VALUE" --type $PARAMETER_TYPE --overwrite --profile "$AWS_PROFILE" --region "$REGION" >/dev/null
    echo "done"
  else
    echo No
    echo "Leaving existing value"
    exit
  fi
fi

if [ "$ENV_LOCATION" == "backend" ]; then
  if grep -q "$NAME:" "packages/api/serverless.yml"; then
    echo "Variable is already in packages/api/serverless.yml, will not duplicate"
  else
    echo "Updating packages/api/serverless.yml..."
    sed -i.bak "s/.*  environment:.*/&\n    $NAME: \${ssm:\/\${env:APP_NAME}\/\${opt:stage}\/$NAME, \"\"}/" packages/api/serverless.yml
    rm packages/api/serverless.yml.bak
  fi
else
  if grep -q "$NAME=" "scripts/generate-env-vars.sh"; then
    echo "Variable is already in scripts/generate-env-vars.sh, will not duplicate"
  else
    echo "Updating scripts/generate-env-vars.sh..."
    NEW_VAR_CODE="$NAME=\$(aws ssm get-parameter --name \"\/$APP_NAME\/\$STACK_STAGE\/$NAME\" --with-decryption --query 'Parameter.Value' --output text --profile \"\${AWS_PROFILE}\" --region \"\${REGION}\")\nOUTPUT=\$(printf \"%s\\\nREACT_APP_$NAME=%s\" \"\${OUTPUT}\" \"\${$NAME}\"\)"
    sed -i.bak "s/.*# Additional.*/&\n${NEW_VAR_CODE}/g" scripts/generate-env-vars.sh
    rm scripts/generate-env-vars.sh.bak
  fi

  if grep -q "      'REACT_APP_$NAME" "packages/web/vite.config.ts"; then
    echo "Variable is already in packages/web/vite.config.ts, will not duplicate"
  else
    echo "Updating packages/web/vite.config.ts..."
    NEW_VAR_TYPE="      'REACT_APP_$NAME'"
    sed -i.bak "s/.*    EnvironmentPlugin(\[.*/&\n${NEW_VAR_TYPE},/g" packages/web/vite.config.ts
    rm packages/web/vite.config.ts.bak
  fi

  if grep -q "      'REACT_APP_$NAME" "packages/admin/vite.config.ts"; then
    echo "Variable is already in packages/admin/vite.config.ts, will not duplicate"
  else
    echo "Updating packages/admin/vite.config.ts..."
    NEW_VAR_TYPE="      'REACT_APP_$NAME'"
    sed -i.bak "s/.*    EnvironmentPlugin(\[.*/&\n${NEW_VAR_TYPE},/g" packages/admin/vite.config.ts
    rm packages/admin/vite.config.ts.bak
  fi

  echo "Generating fresh env vars file..."
  pnpm run generate:env:"${STAGE}" >/dev/null
fi

echo "done - don't forget to add the variable to all stages"
