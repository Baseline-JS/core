import { {{ nameFirst }} } from '@baseline/types/{{ nameKebab }}';
import { getDynamodbConnection } from '../dynamodb/dynamodb';
import { ServiceObject } from '../../util/service-object';

const dynamoDb = getDynamodbConnection();

export const {{ nameCamel }}Service = new ServiceObject<{{ nameFirst }}>({
  dynamoDb: dynamoDb,
  objectName: '{{ nameFirst }}',
  table: `${process.env.{{ nameSnakeUpper }}_TABLE}`,
  primaryKey: '{{ primaryKey }}',
});
