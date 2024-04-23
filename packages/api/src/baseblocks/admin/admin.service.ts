import { Admin } from '@baseline/types/admin';
import { getErrorMessage } from '../../util/error-message';
import { getDynamodbConnection } from '@baselinejs/dynamodb';
import { ServiceObject } from '../../util/service-object';

const dynamoDb = getDynamodbConnection({
  region: `${process.env.API_REGION}`,
});

export const adminService = new ServiceObject<Admin>({
  dynamoDb: dynamoDb,
  objectName: 'Admin',
  table: `${process.env.APP_NAME}-${process.env.NODE_ENV}-admin`,
  primaryKey: 'userSub',
});

export const isAdminSub = async (userSub: string): Promise<boolean> => {
  console.log(`Is ${userSub} Admin`);
  try {
    const admin = await adminService.get(userSub);
    return !!admin?.userSub;
  } catch (error) {
    const message = getErrorMessage(error);
    console.error(`Failed to check if admin: ${message}`);
    return false;
  }
};
