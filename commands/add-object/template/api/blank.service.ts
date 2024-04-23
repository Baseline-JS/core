import { {{ nameFirst }} } from '@baseline/types/{{ nameKebab }}';
import { getDynamodbConnection } from '@baselinejs/dynamodb';
import { ServiceObject } from '../../util/service-object';

const dynamoDb = getDynamodbConnection({
  region: `${process.env.API_REGION}`,
});

export const {{ nameCamel }}Service = new ServiceObject<{{ nameFirst }}>({
  dynamoDb: dynamoDb,
  objectName: '{{ nameFirst }}',
  table: `${process.env.APP_NAME}-${process.env.NODE_ENV}-{{ nameKebab }}`,
  primaryKey: '{{ primaryKey }}',
});
