import { Injectable, SetMetadata } from '@nestjs/common';
import { EVENT_HANDLER_REFLECT_KEY } from './events.static';

export const HandleEvent = (...eventNames: string[]) =>
  SetMetadata(EVENT_HANDLER_REFLECT_KEY, eventNames);

@Injectable()
export class ConsumerService {
  // @SqsMessageHandler('field-created-queue')
  // async handleMessage(message: Message) {
  //   const msgBody = JSON.parse(message.Body);
  //
  //   try {
  //     console.log('Handling SQS message');
  //     console.log(msgBody);
  //   } catch (error) {
  //     console.log('Consumer error!');
  //   }
  // }

  @HandleEvent('CreateGrowingPeriodV1')
  public createdGrowingPeriodHandler(body: {
    eventName: string;
    content: string;
  }) {
    console.log('Handling SQS message in custom handler!');
    console.log(body.eventName);
    console.log(body.content);
  }
}
