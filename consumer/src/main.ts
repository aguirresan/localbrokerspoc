import { Consumer } from 'sqs-consumer';
import { Message, SQSClient } from '@aws-sdk/client-sqs';
import { fromIni } from '@aws-sdk/credential-providers';

const sqsClient = new SQSClient({
  endpoint: 'http://localhost:4566',
  region: 'us-east-1',
  credentials: fromIni({ profile: 'localstack' }),
});

const app = Consumer.create({
  queueUrl:
    'http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/field-events-queue',
  pollingWaitTimeMs: 1000,
  handleMessage(message: Message): Promise<Message | void> {
    return new Promise(() => {
      console.log(message.Body);
    });
  },
  sqs: sqsClient,
});

app.start();
