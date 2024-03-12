# Client API

A client side library intended to be used in multiple clients, such as admin, web and mobile. It handles authenticated and un-authenticated requests to the projects API.

## Type Naming

Consider naming after the group of API endpoints, such as Admin, for all admin API requests.

## Working With Baseblocks

New api endpoints may be manually added to this folder. A Baseblock may also add new API files during its installation.

## Using Client API in a Client

Add a new "include" to the client `tsconfig.json` (e.g. `packages/web/tsconfig.json`)

```
"include": ["../shared/client-api"]
```

Add a new dependency to the client `package.json` (e.g. `packages/web/package.json`)

```
"@baseline/client-api": "1.0.0",
```

Referencing the client api in code

```
import { createAdmin } from '@baseline/client-api/admin';
```

If you are having issues with your IDE showing this package as not existing attempt restarting your IDE TS Server and IDE ESLint Server.

## Note on Amplify

Since the package uses Amplify Auth for handling requests the same version must match all client versions or you will find that API requests will have authentication issues.

Confirm `aws-amplify` version in `package.json` is the same as the client `package.json`.
