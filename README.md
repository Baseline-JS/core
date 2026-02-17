> [!IMPORTANT]
> **This repository is no longer actively maintained.** The full history remains available for reference, but no further updates, fixes, or support will be provided here.
>
> Want to get in touch with the team? **[Contact us at baselinejs.com/contact](https://baselinejs.com/contact)**

![1688515420018](https://github.com/Baseline-JS/core/assets/151841910/620fa869-4bca-418d-af2c-3a3f8b2d2719)

# BaselineJS

BaselineJS is an open-source, fullstack TypeScript, serverless first framework designed to make building cloud native applications easier. Our framework utilizes a combination of modern technologies, architectures and operational processes to help teams to efficiently build and deploy robust applications

[Website](https://baselinejs.com/) |
[Contact](https://baselinejs.com/contact) |
[LinkedIn](https://www.linkedin.com/company/baselinejs)

# Getting Started

Video walkthroughs setting up Baseline

- [Baseline Demo](https://www.youtube.com/watch?v=db5gxYWAf1E)
- [Baseline with Windows Subsystem Linux](https://www.youtube.com/watch?v=sxrQxoibUgI)
- [Baseline with GitHub Codespaces](https://www.youtube.com/watch?v=uvL9PxdijXA)
- [Baseline Simplified Workshop](https://youtu.be/YWh5iVaTq_w)

# Setup

## Quick Start

`npx @baselinejs/quickstart`

The quick start command will:

- Install all requirements
- Create a new Baseline project
- Set up AWS credentials
- Deploy to staging
- Create an admin user
- Output the URLs for the project

You may need to install npm if npx is not available, you can do this by installing [Node.js](https://nodejs.org/en/download/)

## Create App

If you prefer a more manual setup, follow the steps below.

1. [Install requirements](#local-requirements) `pnpm run install:requirements`
2. `npx @baselinejs/create-app my-app-name`
3. `pnpm install`
4. `pnpm run setup` to name your project and set the region
5. `pnpm run aws:profile` to setup your AWS credentials profile (if you have issues please [update aws cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html]))
6. `pnpm run deploy:staging` to deploy api/web/admin
7. `pnpm run add:user:staging` to add an admin user to the application
8. `pnpm run urls:staging` To see your project URLs

## Local Requirements

These must be installed before following the setup instructions. These can be installed manually or by using the requirements installation script.

- Macos/Linux OS/Windows Subsystem for Linux
  - Node.js v20 (v20 or higher) & npm@10.5.0 or higher [(we suggest installing and using nvm)](https://github.com/nvm-sh/nvm#install--update-script) follow instructions in the link to install, you will generally need to create a new terminal session after installing. If you already have nvm update it before proceeding.
    - If nvm is installed you can switch versions with `nvm install 20 && nvm use 20 && nvm alias default 20 && nvm install-latest-npm`
    - If not using nvm you can manually install node and npm, download from <https://nodejs.org/en/download/> alternatively use the operating system package manager or any other appropriate tool to install node
    - Current versions can be checked with `node -v`, `npm -v`
  - pnpm version 9, version can be checked with `pnpm -v`, install with `npm install -g pnpm@9` [or other methods](https://pnpm.io/installation)
  - [AWS CLI v2](https://aws.amazon.com/cli)
  - Homebrew, for Mac users only, follow install instructions [here](https://brew.sh/)
  - [jq](https://stedolan.github.io/jq/download/) for extracting Cloudformation outputs
    - Install on mac `brew install jq`
    - Install on Linux `sudo yum install jq` or `sudo apt-get install jq`, or other appropriate methods
  - Java Runtime Environment (JRE) version 8.x or newer, it is only required for [DynamoDB local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html)
    - Install on mac `brew install temurin`
    - Install on linux `sudo yum install java` or `sudo apt-get install openjdk-8-jdk`, or other appropriate methods
    - DynamoDB local will automatically install in the project when the api is started, java needs to installed before this occurs
  - curl which is used in some of the bash scripts, [curl install instructions](https://everything.curl.dev/get)
  - An IDE such as [Visual Studio Code](https://code.visualstudio.com/)
- Internet connectivity
- AWS Account <https://aws.amazon.com/getting-started/>
- IAM credentials <https://docs.aws.amazon.com/cli/latest/userguide/getting-started-prereqs.html#getting-started-prereqs-iam> be sure to follow [Security best practices in IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)

### Requirements Installation

Run the following command to install the requirements.

If you are starting a new Baseline project.

```bash
curl -o- https://raw.githubusercontent.com/Baseline-JS/core/main/scripts/install-requirements.sh | bash
```

or

```bash
wget -qO- https://raw.githubusercontent.com/Baseline-JS/core/main/scripts/install-requirements.sh | bash
```

If you are joining an existing Baseline project make sure you run the requirements installation script in the root of the project. This will install the requirements for the project.

```bash
pnpm run install:requirements
```

## Run Locally

If the project is already setup and you are trying run the project locally make sure you run `pnpm run aws:profile` first so that you have the correct credentials for AWS configured locally.

### Commands

Start the api, admin and web in their own terminal windows/tabs with the following commands.

1. `pnpm run generate:env:local` to generate the env files for the frontend clients
2. `pnpm run start:api`
3. `pnpm run start:admin`
4. `pnpm run start:web`

### Running locally Limitations

- API, Web & Admin: No S3, you will need to rely on AWS staging S3
- API: No local Cognito Authorizer, the deployed staging cognito can be used (see `packages/api/serverless.yml`) or the payload set by `AUTHORIZER` in `packages/api/scripts/run-api-local.sh`.
- Admin: Cognito UI relies on an active AWS Cognito user pool, use deployed staging

## Deploy a Change

Swap `staging` to `prod` to deploy to production. All environment variables will be automatically set in the process.

1. `pnpm run deploy:staging` to deploy api/web/admin

## Remove Stack

To destroy the deployed cloudformation stacks so it is no longer on AWS run `pnpm run remove:staging`. This will likely destroy all data associated with the application.

## Major Components

- 🚀 API
- 🖥️ React Admin Website
- 🌐 React User Website
- ⚙️ CI/CD
- 🔧 Developer Tooling
- 🔒 Authentication
- 🔄 Multiple Environments
- 💻 Run Locally
- 🏗️ Infrastructure as Code (IaC)
- 📦 Managed Environment Variables
- ✨ Baseline Commands

## Technology

- 🎁 Package Management: Pnpm + Monorepo
- 🔨 Language & Build: TypeScript + ESBuild
- 🖼 Frontend: React + Vite
- ⚙️ Backend: NodeJS + Express
- 🎨 Linting & Formatting: Prettier + Eslint
- 🏗 IaC: AWS + Serverless Framework
- 🚀 Deploy: Local/Bitbucket/GitHub CI/CD

## AWS Services

- Cognito
- S3
- Lambda
- DynamoDB
- CloudFormation
- Route53
- Systems Manager
- CloudFront
- API Gateway
- CloudWatch
- SNS

## What can you build with Baseline?

- 🌐 SaaS Solutions: Build software-as-a-service solutions tailored to your audience.
- 🖥️ Web Applications: Develop responsive and scalable web applications.
- 🛒 Marketplaces: Launch and manage online marketplaces with ease.
- 📱 Mobile Applications: Create robust mobile apps for iOS and Android platforms.
- 💼🛍️ B2B/B2C Applications: Seamlessly cater to both business and consumer audiences.
- 🗄️ Headless CMS: Manage content efficiently using a headless content management system.

## Benefits

- Serverless First
- Open source
- Full control
- Cost effective implementation
- Hosted in your own AWS account
- Uses popular technology
- Scales on demand
- Staging and production environments
- Runs locally

# Baseline

If you would like to learn more about what we do please visit [Baseline](https://baselinejs.com/)
