# Types

The types package is used for types that are used in multiple parts of the application. For example the API endpoint response type and the web front end that needs to handle the response type.

## Type Naming

Consider making names specific to their use case, such as including a response or endpoint name in the type names. E.g. `ApiNewUserResponse`.

## Working With Baseblocks

New types can be manually added to this folder. A Baseblock may also add new type files during its installation.

## Using Types in a Client

Add a new "include" to the client `tsconfig.json` (e.g. `packages/web/tsconfig.json`)

```
"include": ["../../shared/types"]
```

Add a new dependency to the client `package.json` (e.g. `packages/web/package.json`)

```
"@baseline/types": "1.0.0",
```

Referencing the type in code

```
import { Admin } from '@baseline/types/admin';
```

If you are having issues with your IDE showing this package as not existing attempt restarting your IDE TS Server and IDE ESLint Server.
