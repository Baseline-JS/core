#!/usr/bin/env bash

. ./scripts/project-variables.sh

echo "APP_NAME=$APP_NAME" >>"$GITHUB_ENV"
echo "AWS_PROFILE_GITHUB=$AWS_PROFILE" >>"$GITHUB_ENV" # AWS_PROFILE is a reserved variable
echo "REGION=$REGION" >>"$GITHUB_ENV"
echo "AWS_REGION=$AWS_REGION" >>"$GITHUB_ENV"
