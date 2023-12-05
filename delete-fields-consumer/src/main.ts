import { Consumer } from 'sqs-consumer';
import { DeleteMessageCommand, Message, SQSClient } from '@aws-sdk/client-sqs';
import { fromIni } from '@aws-sdk/credential-providers';

const sqsClient = new SQSClient({
  endpoint: 'http://localhost:4566',
  region: 'us-east-1',
  credentials: fromIni({ profile: 'localstack' }),
});

const app = Consumer.create({
  queueUrl:
    'http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/field-deleted-queue',
  pollingWaitTimeMs: 1000,
  async handleMessage(message: Message): Promise<Message | void> {
    await sqsClient.send(
      new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: message.ReceiptHandle,
      }),
    );

    return new Promise(() => {
      console.log(message.Body);
    });
  },
  sqs: sqsClient,
});

app.start();
