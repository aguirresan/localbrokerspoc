import { Injectable } from '@nestjs/common';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { fromIni } from '@aws-sdk/credential-providers';

@Injectable()
export class AppService {
  client: SNSClient;
  topicArn = 'arn:aws:sns:us-east-1:000000000000:field-deleted-topic';

  constructor() {
    this.client = new SNSClient({
      endpoint: 'http://localhost:4566',
      region: 'us-east-1',
      credentials: fromIni({ profile: 'localstack' }),
    });
  }

  getHello(): string {
    return 'Hello World!';
  }

  async publishMessage(message: string): Promise<unknown> {
    const command = new PublishCommand({
      TopicArn: this.topicArn,
      Message: JSON.stringify(message),
    });
    return await this.client.send(command);
  }
}
