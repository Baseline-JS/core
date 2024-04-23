import { getErrorMessage } from './error-message';
import {
  batchGetItems,
  deleteItem,
  getItem,
  getAllItems,
  putItem,
  updateItem,
  DynamoDbDocumentClient,
} from '@baselinejs/dynamodb';
import { randomUUID } from 'crypto';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ServiceObject<T extends Record<string, any>> {
  table: string;
  dynamoDb: DynamoDbDocumentClient;
  objectName: string;
  primaryKey: string;
  ownerField: string | undefined;

  constructor(params: {
    table: string;
    objectName: string;
    dynamoDb: DynamoDbDocumentClient;
    primaryKey: string;
    ownerField?: string;
  }) {
    this.dynamoDb = params.dynamoDb;
    this.table = params.table;
    this.objectName = params.objectName;
    this.primaryKey = params.primaryKey;
    this.ownerField = params.ownerField;
  }

  async getAll(): Promise<T[]> {
    console.log(`Get all ${this.objectName} records`);
    try {
      if (!this.dynamoDb) {
        throw new Error('DynamoDB not connected');
      }
      return getAllItems<T>({
        dynamoDb: this.dynamoDb,
        table: this.table,
      });
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to get ${this.objectName}: ${message}`);
      throw new Error(message);
    }
  }

  async get(key: string): Promise<T> {
    console.log(`Get ${this.objectName} by ${this.primaryKey} [${key}]`);
    try {
      if (!this.dynamoDb) {
        throw new Error('DynamoDB not connected');
      }
      return await getItem<T>({
        dynamoDb: this.dynamoDb,
        table: this.table,
        key: {
          [this.primaryKey]: `${key}`,
        },
      });
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to get ${this.objectName}: ${message}`);
      throw new Error(message);
    }
  }

  async create(record: Partial<T>): Promise<T> {
    console.log(`Create ${this.objectName}`);
    try {
      if (!this.dynamoDb) {
        throw new Error('DynamoDB not connected');
      }
      const item: Partial<T> = {
        [this.primaryKey]: randomUUID(),
        ...record,
      };
      return await putItem<T>({
        dynamoDb: this.dynamoDb,
        table: this.table,
        item: item as T,
      });
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to create ${this.objectName}: ${message}`);
      throw new Error(message);
    }
  }

  async update(record: Partial<T>): Promise<T> {
    console.log(
      `Update ${this.objectName} ${this.primaryKey} [${
        record[this.primaryKey]
      }]`,
    );
    try {
      if (!this.dynamoDb) {
        throw new Error('DynamoDB not connected');
      }
      if (!record[this.primaryKey]) {
        throw new Error(`Cannot update without ${this.primaryKey}`);
      }
      const partial = {} as Partial<T>;
      Object.keys(record).forEach((key: keyof T) => {
        if (key !== this.primaryKey) {
          partial[key] = record[key];
        }
      });
      return await updateItem<T>({
        dynamoDb: this.dynamoDb,
        table: this.table,
        key: {
          [this.primaryKey]: `${record[this.primaryKey]}`,
        },
        fields: partial,
      });
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to update ${this.objectName}: ${message}`);
      throw new Error(message);
    }
  }

  async delete(keyValue: string): Promise<boolean> {
    console.log(`Delete ${this.objectName} ${keyValue}`);
    try {
      if (!this.dynamoDb) {
        throw new Error('DynamoDB not connected');
      }
      return await deleteItem({
        dynamoDb: this.dynamoDb,
        table: this.table,
        key: {
          [this.primaryKey]: keyValue,
        },
      });
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to delete ${this.objectName}: ${message}`);
      throw new Error(message);
    }
  }

  async batchGet(ids: string[]): Promise<T[]> {
    console.log(`Getting all ${this.objectName} by ids`);
    try {
      if (!this.dynamoDb) {
        throw new Error('DynamoDB not connected');
      }
      const keys = ids.map((id) => {
        return {
          [this.primaryKey]: id,
        };
      });
      return await batchGetItems<T>({
        dynamoDb: this.dynamoDb,
        keys: keys,
        table: this.table,
      });
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to batch get ${this.objectName}: ${message}`);
      throw new Error(message);
    }
  }

  async isOwner(id: string, userSub: string) {
    if (this.ownerField) {
      const record = await this.get(id);
      return record[this.ownerField] === userSub;
    }
    return false;
  }
}
