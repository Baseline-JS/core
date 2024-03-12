# Scripts

Baseline root level scripts are designed for common actions required on the project rather than client/api specific actions (these live in their respective client e.g. `/api/scripts`). Running scripts directly should be avoided by the project developers, instead make the scripts npm scripts so that future changes to the script does not affect how developers use Baseline.

## Deploy

A generic script for handling the deployment for a specific client/api. Only used for deployment in GitHub or Bitbucket pipelines.

The single argument is the folder path which we are installing. This allows use to call the appropriate npm script, such as `npm run deploy:prod`.

Expected usage

```
./scripts/deploy.sh api
```

## Setup AWS Profile

A script for managing the AWS profile easily for the project. Only expected to be used by developers locally.

The developer will always need AWS I AM security credentials for local deployment or utilizing any AWS feature that requires the API to hit an AWS service.

Includes testing the AWS credentials

Expected usage

```
./scripts/setup-aws-profile.sh
```

Developer usage

```
npm run aws:profile
```

It is recommended that clients also add the ability to run in client/api folders to make it easy to access as some projects will use SSO with frequently expiring credentials.

## Setup AWS

A script designed for use in GitHub and Bitbucket deployments for setting the correct AWS profiles values based on the pipeline environment variables. Since GitHub and Bitbucket work differently there is some logic to handle things differently, see code for specifics.

Expected usage

```
./scripts/setup-aws.sh
```

## Setup NPM

Setup NPM variables, set npm version, install pnpm which is required for the remaining deployment operations. Only used in GitHub/Bitbucket deployment pipelines and is expected to run first.

Expected usage

```
./scripts/setup-npm.sh
```
