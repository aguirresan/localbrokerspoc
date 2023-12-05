import { Injectable } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { Message } from '@aws-sdk/client-sqs';

@Injectable()
export class ConsumerService {
  @SqsMessageHandler('field-deleted-queue')
  async handleMessage(message: Message) {
    const msgBody = JSON.parse(message.Body);

    try {
      console.log('Handling SQS message');
      console.log(msgBody);
    } catch (error) {
      console.log('Consumer error!');
    }
  }
}
