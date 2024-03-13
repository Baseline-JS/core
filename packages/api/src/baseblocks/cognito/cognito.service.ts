import * as AWS_CognitoIdentityServiceProvider from '@aws-sdk/client-cognito-identity-provider';

const { CognitoIdentityProvider: CognitoIdentityServiceProvider } =
  AWS_CognitoIdentityServiceProvider;

const cognito = new CognitoIdentityServiceProvider({
  region: process.env.API_REGION || 'ap-southeast-2',
});

export async function getUserAttributesByEmail(userEmail: string) {
  try {
    const formattedEmail = userEmail?.toLowerCase();
    const existingResponse = await cognito.adminGetUser({
      UserPoolId: `${process.env.COGNITO_USER_POOL_ID}`,
      Username: `${formattedEmail}`,
    });
    console.log(JSON.stringify(existingResponse, null, 2));
    const attributes = existingResponse?.UserAttributes?.reduce(
      (prev, attr) => {
        if (attr?.Name) {
          prev[attr.Name] = `${attr.Value}`;
        }
        return prev;
      },
      {} as { [key: string]: string },
    );

    return attributes;
  } catch (error) {
    console.log('No user found: ', error);
  }
}

export async function createUser(userEmail: string) {
  try {
    const formattedEmail = userEmail?.toLowerCase();
    const userAttributes = [
      {
        Name: 'email',
        Value: formattedEmail,
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
    ];
    const cognitoUser = await cognito.adminCreateUser({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: formattedEmail,
      UserAttributes: userAttributes,
      DesiredDeliveryMediums: ['EMAIL'],
    });

    console.log(JSON.stringify(cognitoUser, null, 2));

    const attributes = cognitoUser.User?.Attributes?.reduce((prev, attr) => {
      if (attr.Name) {
        prev[attr.Name] = `${attr.Value}`;
      }
      return prev;
    }, {} as { [key: string]: string });

    return attributes;
  } catch (error) {
    console.log('Failed to create cognito user', error);
  }
}

export async function getUsers(args: {
  subFilter?: string;
  usernameFilter?: string;
  emailFilter?: string;
  phoneNumberFilter?: string;
  nameFilter?: string;
  givenNameFilter?: string;
  familyNameFilter?: string;
  pageSize?: number;
  paginationToken?: string;
  isExactMatch?: boolean;
}): Promise<
  AWS_CognitoIdentityServiceProvider.ListUsersCommandOutput | undefined
> {
  const {
    subFilter,
    usernameFilter,
    emailFilter,
    nameFilter,
    givenNameFilter,
    familyNameFilter,
    phoneNumberFilter,
    pageSize,
    paginationToken,
    isExactMatch,
  } = args;

  try {
    const requestArgs = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Limit: pageSize || 50,
      PaginationToken: paginationToken,
    } as AWS_CognitoIdentityServiceProvider.ListUsersCommandInput;

    let field = '';
    let value = '';
    const comparison = `${isExactMatch ? '' : '^'}=`;

    if (subFilter) {
      field = 'sub';
      value = subFilter;
    }

    if (usernameFilter) {
      field = 'username';
      value = usernameFilter;
    }

    if (emailFilter) {
      field = 'email';
      value = emailFilter;
    }

    if (phoneNumberFilter) {
      field = 'phone_number';
      value = phoneNumberFilter;
    }

    if (nameFilter) {
      field = 'name';
      value = nameFilter;
    }

    if (givenNameFilter) {
      field = 'given_name';
      value = givenNameFilter;
    }

    if (familyNameFilter) {
      field = 'family_name';
      value = familyNameFilter;
    }

    if (field) {
      requestArgs.Filter = `${field} ${comparison} "${value}"`;
    }

    const response = await cognito.listUsers(requestArgs);
    return response;
  } catch (error) {
    console.log('No users found: ', error);
  }
}
