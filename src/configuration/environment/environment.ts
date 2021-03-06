import * as GetEnv from 'getenv';

import {
  IConfigAWS,
  IConfigAWSAccount, IConfigAWSS3,
  IConfigDynamoDB,
  IConfigEnv,
  IConfigMasterKey,
  IConfigMediaConvert,
  IConfigVideo
} from '@models/interfaces';

export class Environment {
  public static get aws(): IConfigAWS {
    return {
      apiVersion: GetEnv.string('AWS_API_VERSION'),
      accessKeyId: GetEnv.string('AWS_KEY'),
      region: GetEnv.string('AWS_REGION_CODE'),
      secretAccessKey: GetEnv.string('AWS_SECRET')
    };
  }

  public static get awsAccount(): IConfigAWSAccount {
    return {
      accountId: GetEnv.string('AWS_ACCOUNT_ID')
    };
  }

  public static get awsS3(): IConfigAWSS3 {
    return {
      accessKeyId: GetEnv.string('AWS_S3_KEY'),
      secretAccessKey: GetEnv.string('AWS_S3_SECRET')
    };
  }

  public static get dynamoDB(): IConfigDynamoDB {
    return {
      readCapacityUnits: GetEnv.int('AWS_DYNAMO_DB_READ_CAPACITY_UNITS'),
      writeCapacityUnits: GetEnv.int('AWS_DYNAMO_DB_WRITE_CAPACITY_UNITS'),
      limit: GetEnv.int('AWS_DYNAMO_DB_LIMIT')
    };
  }

  public static get env(): IConfigEnv {
    return {
      serverless: GetEnv.string('SERVERLESS_NAME'),
      stage: GetEnv.string('ENVIRONMENT')
    };
  }

  public static get master(): IConfigMasterKey {
    return {
      key: GetEnv.string('MASTER_KEY')
    };
  }

  public static get mediaConvert(): IConfigMediaConvert {
    return {
      jobTemplate: GetEnv.string('AWS_MEDIA_CONVERT_JOB_TEMPLATE'),
      options: {
        apiVersion: GetEnv.string('AWS_MEDIA_CONVERT_API_VERSION'),
        endpoint: GetEnv.string('AWS_MEDIA_CONVERT_ENDPOINT')
      },
      /* tslint:disable-next-line max-line-length */
      inputBucket: `${this.env.serverless}-${this.awsAccount.accountId}-${this.env.stage}-${GetEnv.string('AWS_MEDIA_CONVERT_INPUT_BUCKET')}`,
      /* tslint:disable-next-line max-line-length */
      outputBucket: `${this.env.serverless}-${this.awsAccount.accountId}-${this.env.stage}-${GetEnv.string('AWS_MEDIA_CONVERT_OUTPUT_BUCKET')}`,
      role: `arn:aws:iam::${this.awsAccount.accountId}:role/${GetEnv.string('AWS_MEDIA_CONVERT_ROLE')}`
    };
  }

  public static get video(): IConfigVideo {
    return {
      fields: GetEnv.int('VIDEO_MAX_FIELDS'),
      fileSize: GetEnv.int('VIDEO_MAX_FILE_SIZE'),
      files: GetEnv.int('VIDEO_MAX_FILES')
    };
  }
}
