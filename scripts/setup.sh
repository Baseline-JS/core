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
echo "Please select a region: "
options=(
    "us-east-1 (US East - N. Virginia)"
    "us-east-2 (US East - Ohio)"
    "us-gov-east-1 (US Gov East)"
    "us-gov-west-1 (US Gov West)"
    "us-iso-east-1 (US ISO East)"
    "us-iso-west-1 (US ISO West)"
    "us-isob-east-1 (US ISOB East - Ohio)"
    "us-west-1 (US West - N. California)"
    "us-west-2 (US West - Oregon)"
    "af-south-1 (Africa - Cape Town)"
    "ap-east-1 (Asia Pacific - Hong Kong)"
    "ap-northeast-1 (Asia Pacific - Tokyo)"
    "ap-northeast-2 (Asia Pacific - Seoul)"
    "ap-northeast-3 (Asia Pacific - Osaka)"
    "ap-south-1 (Asia Pacific - Mumbai)"
    "ap-south-2 (Asia Pacific - Hyderabad)"
    "ap-southeast-1 (Asia Pacific - Singapore)"
    "ap-southeast-2 (Asia Pacific - Sydney)"
    "ap-southeast-3 (Asia Pacific - Jakarta)"
    "ap-southeast-4 (Asia Pacific - Melbourne)"
    "ca-central-1 (Canada - Central)"
    "cn-north-1 (China - Beijing)"
    "cn-northwest-1 (China - Ningxia)"
    "eu-central-1 (Europe - Frankfurt)"
    "eu-central-2 (Europe - Zurich)"
    "eu-north-1 (Europe - Stockholm)"
    "eu-south-1 (Europe - Milan)"
    "eu-south-2 (Europe - Spain)"
    "eu-west-1 (Europe - Ireland)"
    "eu-west-2 (Europe - London)"
    "eu-west-3 (Europe - Paris)"
    "me-central-1 (Middle East - UAE)"
    "me-south-1 (Middle East - Bahrain)"
    "sa-east-1 (South America - São Paulo)"
)
APP_REGION=""
select opt in "${options[@]}"; do
    # Remove the description by deleting everything from " (" to the end
    APP_REGION="${opt%% (*}"
    echo "You selected $APP_REGION"
    break
done
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
