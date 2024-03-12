#!/usr/bin/env bash

CURRENT_DIR="$(pwd -P)"
PARENT_PATH="$(
    cd "$(dirname "${BASH_SOURCE[0]}")" || exit
    pwd -P
)/.."
cd "$PARENT_PATH" || exit

echo
printf "\033[32m%s\033[39m\n" "Welcome to Baseline"
echo "-------------------"
echo
echo "Lets setup your new application!"
echo
if ! command -v aws &>/dev/null; then
    echo "AWS CLI could not be found, please install it before continuing."
    echo "You can find instructions here: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html"
    exit
fi
printf "Enter the name of your new application (e.g. my-new-app): "
read -r PROJECT_NAME
sed -i '' -e "s|baseline-core|$PROJECT_NAME|g" ./scripts/project-variables.sh >/dev/null 2>&1
sed -i '' -e "s|baseline-core|$PROJECT_NAME|g" ./scripts/setup.sh >/dev/null 2>&1
echo
echo "Awesome, lets set a region where the app will be hosted!"
echo
echo "AWS uses regions to store your app, you can find a list of regions here: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-available-regions"
echo
echo "The default region is [$(aws configure get region)], leave blank to continue using it."
printf "> "
read -r APP_REGION
if [ -z "$APP_REGION" ]; then
    echo "Using default region [$(aws configure get region)]"
    APP_REGION=$(aws configure get region)
fi
sed -i '' -e "s|ap-southeast-2|$APP_REGION|g" ./scripts/project-variables.sh >/dev/null 2>&1
echo
echo "Great, lets get started!"
echo "------------------------"
echo "To finish setting up your application you will need to run the following commands:"
echo "- [pnpm run aws:profile] to setup your AWS credentials profile"
echo "- [pnpm run deploy:staging] to deploy api/web/admin"
echo "- [pnpm run add:user:staging] to add an admin user to the application"
echo "- [pnpm run urls:staging] To see your project URLs"
echo
echo "After that you will be able to run it locally! 🎉"
echo "-----------------------------------------------"
echo "1. [pnpm run generate:env:local]" to generate env files for admin and web
echo "2. [pnpm run start:api]"
echo "3. [pnpm run start:admin]"
echo "4. [pnpm run start:web]"
echo
echo "If you have any questions or need help, please reach out to us at https://baselinejs.com"
echo
printf "\033[32m%s\033[39m\n" "Happy coding!"

cd "$CURRENT_DIR" || exit
