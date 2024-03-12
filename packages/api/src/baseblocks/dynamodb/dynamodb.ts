import * as AWS from 'aws-sdk';
import {
  DocumentClient,
  GetItemInput,
  Key,
  ScanInput,
} from 'aws-sdk/clients/dynamodb';
import * as https from 'https';
import { getErrorMessage } from '../../util/error-message';

const IS_OFFLINE = process.env.IS_OFFLINE; // Set by serverless-offline https://github.com/dherault/serverless-offline

export let dynamoDb: AWS.DynamoDB.DocumentClient | undefined = undefined;

function newDynamodbConnection(): DocumentClient {
  console.log('DynamoDB Init');

  const agent = new https.Agent({
    keepAlive: true,
    maxSockets: Infinity, // Infinity is read as 50 sockets
  });
  let newConnection: AWS.DynamoDB.DocumentClient;
  if (IS_OFFLINE === 'true') {
    newConnection = new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000',
    });
  } else {
    newConnection = new AWS.DynamoDB.DocumentClient({
      httpOptions: {
        agent,
      },
      paramValidation: false,
      convertResponseTypes: false,
    });
  }
  return newConnection;
}

export const getDynamodbConnection = (): DocumentClient => {
  if (typeof dynamoDb === 'undefined') {
    dynamoDb = newDynamodbConnection();
  }
  return dynamoDb;
};

interface getParams {
  dynamoDb: DocumentClient;
  table: string;
  key: Key;
}

export const get = async <T>(getParams: getParams): Promise<T> => {
  try {
    const params: GetItemInput = {
      TableName: getParams.table || '',
      Key: getParams.key,
    };
    const result = await getParams.dynamoDb.get(params).promise();
    if (result?.$response?.error) {
      throw new Error(result?.$response?.error.message);
    }
    return result.Item as T;
  } catch (error) {
    const message = getErrorMessage(error);
    console.error(`Failed to get record: ${message}`);
    throw new Error(message);
  }
};

interface getAllParams {
  dynamoDb: DocumentClient;
  table: string;
}

export const getAll = async <T>(params: getAllParams): Promise<T[]> => {
  try {
    const scanInputArgs: ScanInput = {
      TableName: params.table || '',
    };
    const allRecords: T[] = [];
    let lastKey: AWS.DynamoDB.DocumentClient.Key | undefined = undefined;
    do {
      const result = await params.dynamoDb.scan(scanInputArgs).promise();
      const resultRecords = result.Items as T[];
      allRecords.push(...resultRecords);
      lastKey = result.LastEvaluatedKey;
      scanInputArgs.ExclusiveStartKey = lastKey;
    } while (lastKey);

    return allRecords;
  } catch (error) {
    const message = getErrorMessage(error);
    console.error(`Failed to get all records: ${message}`);
    throw new Error(message);
  }
};

export const buildConditionExpression = (
  args: ConditionExpressionArgs,
): string => {
  const { operator, value, betweenSecondValue, field } = args;
  let conditionExpression = '';
  switch (operator) {
    case 'BeginsWith':
      conditionExpression = `begins_with(${field}, ${value})`;
      break;
    case 'Equal':
      conditionExpression = `${field} = ${value}`;
      break;
    case 'NotEqual':
      conditionExpression = `${field} <> ${value}`;
      break;
    case 'GreaterThan':
      conditionExpression = `${field} > ${value}`;
      break;
    case 'GreaterThanEqual':
      conditionExpression = `${field} >= ${value}`;
      break;
    case 'LessThan':
      conditionExpression = `${field} < ${value}`;
      break;
    case 'LessThanEqual':
      conditionExpression = `${field} <= ${value}`;
      break;
    case 'Between':
      conditionExpression = `${field} BETWEEN ${value} AND ${betweenSecondValue}`;
      break;
    case 'AttributeNotExists':
      conditionExpression = `attribute_not_exists(${field})`;
      break;
    default:
      throw new Error('Unknown Query Condition type');
  }
  return conditionExpression;
};

export type OperatorType =
  | 'BeginsWith'
  | 'LessThan'
  | 'GreaterThan'
  | 'LessThanEqual'
  | 'GreaterThanEqual'
  | 'Equal'
  | 'NotEqual'
  | 'Between'
  | 'AttributeNotExists';

export interface ConditionExpressionArgs {
  operator: OperatorType;
  field: string;
  value?: string | number;
  /** Used for Between comparison */
  betweenSecondValue?: string;
}

interface UpdateParams<T> {
  dynamoDb: DocumentClient;
  table: string;
  key: Key;
  fields: Partial<Record<keyof T, unknown>>;
  updateConditions?: ConditionExpressionArgs[];
}

export interface UpdateItem {
  name: string;
  attributeName: string;
  attributeValue: unknown;
  ref: string;
}

export const update = async <T>(params: UpdateParams<T>): Promise<T> => {
  console.log(
    `Update record [${Object.keys(params.fields).join(', ')}] on table ${
      params.table
    }`,
  );
  try {
    const updateItems: UpdateItem[] = [];
    Object.keys(params.fields).forEach((element: string, index: number) => {
      if (
        typeof params.fields[element] !== undefined &&
        params.fields[element] !== undefined
      ) {
        updateItems.push({
          name: element,
          attributeName: `#attr${index}`,
          attributeValue: params.fields[element],
          ref: `:attr${index}`,
        });
      }
    });

    // This may not be the best way to handle this
    if (!updateItems.length) {
      console.log('Nothing to update');
      return await get<T>({
        dynamoDb: params.dynamoDb,
        table: params.table,
        key: params.key,
      });
    }

    const updateExpression =
      'set ' + updateItems.map((i) => `${i.attributeName}=${i.ref}`).join(', ');

    const expressionAttributeValues = updateItems.reduce((p, c: UpdateItem) => {
      p[`${c.ref}`] = c.attributeValue;
      return p;
    }, {} as { [key: string]: unknown });

    const expressionAttributeNames = updateItems.reduce((p, c: UpdateItem) => {
      p[`${c.attributeName}`] = c.name;
      return p;
    }, {} as DocumentClient.ExpressionAttributeNameMap);

    const updateItemInput: DocumentClient.UpdateItemInput = {
      TableName: params.table || '',
      Key: params.key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: 'ALL_NEW',
    };

    let count = 0;
    if (params?.updateConditions?.length) {
      updateItemInput.ConditionExpression = '';
      params.updateConditions.forEach((values: ConditionExpressionArgs) => {
        if (updateItemInput.ConditionExpression?.length) {
          updateItemInput.ConditionExpression += ' AND ';
        }
        updateItemInput.ConditionExpression += buildConditionExpression({
          field: `#field${count}`,
          value: `:val${count}`,
          operator: values.operator,
          betweenSecondValue: `#val${count + 1}`,
        });
        expressionAttributeNames[`#field${count}`] = values.field;

        if (values.field) {
          expressionAttributeValues[`:val${count}`] = values.value;
        }

        if (values.betweenSecondValue) {
          expressionAttributeValues[`:val${count + 1}`] =
            values.betweenSecondValue;
        }
        count += 2;
      });
    }

    const result = await params.dynamoDb.update(updateItemInput).promise();
    return result.Attributes as T;
  } catch (error) {
    const message = getErrorMessage(error);
    console.error(`Failed to update record: ${message}`);
    throw new Error(message);
  }
};

interface queryByKeyAndFilterParams {
  dynamoDb: DocumentClient;
  table: string;
  keyName: string;
  keyValue: unknown;
  indexName?: string;
  filterKeyName: string;
  filterKeyValue: unknown;
}

export const queryByKeyAndFilter = async <T>(
  params: queryByKeyAndFilterParams,
): Promise<T[]> => {
  try {
    const queryParams: DocumentClient.QueryInput = {
      TableName: params.table,
      KeyConditionExpression: `#a = :b`,
      FilterExpression: `#c = :d`,
      ExpressionAttributeNames: {
        '#a': params.keyName,
        '#c': params.filterKeyName,
      },
      ExpressionAttributeValues: {
        ':b': params.keyValue,
        ':d': params.filterKeyValue,
      },
    };
    if (params?.indexName) {
      queryParams.IndexName = params?.indexName;
    }

    const allRecords: T[] = [];
    let lastKey: AWS.DynamoDB.DocumentClient.Key | undefined = undefined;
    do {
      const result = await params.dynamoDb.query(queryParams).promise();
      const resultRecords = result.Items as T[];
      allRecords.push(...resultRecords);
      lastKey = result.LastEvaluatedKey;
      queryParams.ExclusiveStartKey = lastKey;
    } while (lastKey);

    return allRecords;
  } catch (error) {
    const message = getErrorMessage(error);
    console.error('Failed to complete query');
    throw new Error(message);
  }
};

interface queryByKeyAndFilterBetweenParams {
  dynamoDb: DocumentClient;
  table: string;
  keyName: string;
  keyValue: unknown;
  indexName?: string;
  filterKeyName: string;
  filterKeyValueMin: unknown;
  filterKeyValueMax: unknown;
}

export const queryByKeyAndFilterBetween = async <T>(
  params: queryByKeyAndFilterBetweenParams,
): Promise<T[]> => {
  try {
    const queryParams: DocumentClient.QueryInput = {
      TableName: params.table,
      KeyConditionExpression: `#a = :b And #c BETWEEN :d AND :e`,
      ExpressionAttributeNames: {
        '#a': params.keyName,
        '#c': params.filterKeyName,
      },
      ExpressionAttributeValues: {
        ':b': params.keyValue,
        ':d': params.filterKeyValueMin,
        ':e': params.filterKeyValueMax,
      },
    };

    if (params?.indexName) {
      queryParams.IndexName = params?.indexName;
    }

    const allRecords: T[] = [];
    let lastKey: AWS.DynamoDB.DocumentClient.Key | undefined = undefined;
    do {
      const result = await params.dynamoDb.query(queryParams).promise();
      const resultRecords = result.Items as T[];
      allRecords.push(...resultRecords);
      lastKey = result.LastEvaluatedKey;
      queryParams.ExclusiveStartKey = lastKey;
    } while (lastKey);

    return allRecords;
  } catch (error) {
    const message = getErrorMessage(error);
    console.error('Failed to complete query');
    throw new Error(message);
  }
};

interface queryByKeyParams {
  dynamoDb: DocumentClient;
  table: string;
  keyName: string;
  keyValue: unknown;
  indexName?: string;
}

export const queryByKey = async <T>(params: queryByKeyParams): Promise<T[]> => {
  try {
    const queryParams: DocumentClient.QueryInput = {
      TableName: params.table,
      KeyConditionExpression: `#a = :b`,
      ExpressionAttributeNames: {
        '#a': params.keyName,
      },
      ExpressionAttributeValues: {
        ':b': params.keyValue,
      },
    };
    if (params?.indexName) {
      queryParams.IndexName = params?.indexName;
    }

    const allRecords: T[] = [];
    let lastKey: AWS.DynamoDB.DocumentClient.Key | undefined = undefined;
    do {
      const result = await params.dynamoDb.query(queryParams).promise();
      const resultRecords = result.Items as T[];
      allRecords.push(...resultRecords);
      lastKey = result.LastEvaluatedKey;
      queryParams.ExclusiveStartKey = lastKey;
    } while (lastKey);

    return allRecords;
  } catch (error) {
    const message = getErrorMessage(error);
    console.error('Failed to complete query');
    throw new Error(message);
  }
};

interface putItemParams<T> {
  dynamoDb: DocumentClient;
  table: string;
  item: T;
}

export const putItem = async <T>(params: putItemParams<T>): Promise<T> => {
  const putItemParams: DocumentClient.PutItemInput = {
    TableName: params.table,
    Item: params.item,
  };
  await params.dynamoDb.put(putItemParams).promise();
  return params.item;
};

interface BatchGetParams {
  dynamoDb: DocumentClient;
  table: string;
  keyName: string;
  ids: string[];
}

// todo multiple table support
export const batchGet = async <T>(params: BatchGetParams): Promise<T[]> => {
  if (!params.ids.length) {
    return [];
  }

  const uniqueIds = params.ids.filter((item, pos) => {
    return params.ids.indexOf(item) === pos;
  });

  const totalBatches = Math.ceil(uniqueIds.length / 100);
  const idBatches: Array<string[]> = [];
  for (let index = 0; index < totalBatches; index++) {
    const start = index * 100;
    const end = start + 100 > uniqueIds.length ? uniqueIds.length : start + 100;
    const batch = uniqueIds.slice(start, end);
    idBatches.push(batch);
  }

  const promises = idBatches.map((batch) => {
    const keys = batch.map((id) => {
      return { [params.keyName]: id };
    });
    const batchGetParams: DocumentClient.BatchGetItemInput = {
      RequestItems: {
        [params.table]: {
          Keys: keys,
        },
      },
    };

    // todo handle multiple pages incase of larger records
    return params.dynamoDb.batchGet(batchGetParams).promise();
  });

  const results = await Promise.all(promises);
  const records = results.flatMap(
    (result) => result.Responses?.[params.table] as T[],
  );

  return records;
};

interface DeleteItemParams {
  dynamoDb: DocumentClient;
  table: string;
  keyName: string;
  keyValue: string;
}

export const deleteItem = async (params: DeleteItemParams) => {
  console.log(
    `Delete ${params.table} : ${params.keyName} : [${params.keyValue}]`,
  );
  try {
    const deleteParams: DocumentClient.UpdateItemInput = {
      TableName: `${params.table}`,
      Key: {},
    };
    deleteParams.Key[`${params.keyName}`] = `${params.keyValue}`;

    await params.dynamoDb.delete(deleteParams).promise();
    return true;
  } catch (error) {
    const message = getErrorMessage(error);
    console.error(`Failed to delete: ${message}`);
    throw new Error(message);
  }
};
