import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import {v4 as uuidv4} from 'uuid';

import {Table} from '@db/tables/table';
import {IConfigDynamoDB, IMigration, IUserGroup} from '@models/interfaces';

export class UserGroupTable extends Table implements IMigration {
  public readonly tableName: string;

  constructor({tableName} = {tableName: 'UserGroups'}) {
    super();
    this.tableName = tableName;
  }

  public batchDelete(items: string[], callback): void {
    this.batchDeleteItem(items, this.tableName, callback);
  }

  public delete(uuid: string, callback): void {
    this.deleteItem(uuid, this.tableName, callback);
  }

  public down(callback): void {
    this.deleteTable(this.tableName, callback);
  }

  public find(uuid: string, callback): void {
    const params: DynamoDB.Types.GetItemInput = {
      Key: {
        'Uuid': {
          S: uuid
        }
      },
      TableName: this.tableName
    };
    this.getItem(params, callback);
  }

  public get(callback, exclusiveStartKey = null): void {
    const params: DynamoDB.Types.ScanInput = {
      ExpressionAttributeNames: {
        '#U': 'Uuid',
        '#N': 'Name',
        '#D': 'Description'
      },
      ProjectionExpression: '#U, #N, #D',
      Limit: this.config.dynamoDB.limit,
      TableName: this.tableName
    };
    if (exclusiveStartKey) {
      params.ExclusiveStartKey = {
        'Uuid': {
          S: exclusiveStartKey
        }
      };
    }
    this.scanTable(params, callback);
  }

  public put(userGroup: IUserGroup, callback): void {
    const params: DynamoDB.Types.PutItemInput = {
      Item: {
        'Uuid': {
          S: uuidv4()
        },
        'Name': {
          S: userGroup.name
        }
      },
      TableName: this.tableName
    };
    if (userGroup.description) {
      params.Item['Description'] = {S: userGroup.description};
    }
    this.putItem(params, callback);
  }

  public up(callback, {
    readCapacityUnits: ReadCapacityUnits,
    writeCapacityUnits: WriteCapacityUnits
  }: IConfigDynamoDB = this.config.dynamoDB): void {
    const params: DynamoDB.Types.CreateTableInput = {
      AttributeDefinitions: [
        {
          AttributeName: 'Uuid',
          AttributeType: 'S'
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits,
        WriteCapacityUnits
      },
      KeySchema: [
        {
          AttributeName: 'Uuid',
          KeyType: 'HASH'
        }
      ],
      TableName: this.tableName
    };
    this.createTable(params, callback);
  }

  public update(userGroup: IUserGroup, callback): void {
    this.updateItem(userGroup, this.tableName, callback);
  }
}
