import { {{ nameFirst }} } from '@baseline/types/{{ nameKebab }}';
import { getDynamodbConnection } from 'baseline-dynamodb';
import { ServiceObject } from '../../util/service-object';

const dynamoDb = getDynamodbConnection();

export const {{ nameCamel }}Service = new ServiceObject<{{ nameFirst }}>({
  dynamoDb: dynamoDb,
  objectName: '{{ nameFirst }}',
  table: `${process.env.APP_NAME}-${process.env.NODE_ENV}-{{ nameSnakeUpper }}`,
  primaryKey: '{{ primaryKey }}',
});
