import { Injectable } from '@nestjs/common';
import { fromIni } from '@aws-sdk/credential-providers';
import {
  EventBridgeClient,
  PutEventsCommand,
  PutEventsRequestEntry,
} from '@aws-sdk/client-eventbridge';
import { FieldEventsDto } from './schema/FieldEvents.dto';

@Injectable()
export class AppService {
  client: EventBridgeClient;
  eventBusName = 'yara-eu-events-bus';

  constructor() {
    this.client = new EventBridgeClient({
      endpoint: 'http://localhost:4566',
      region: 'us-east-1',
      credentials: fromIni({ profile: 'localstack' }),
    });
  }

  async putEvents(events: FieldEventsDto[]): Promise<unknown> {
    const enrichedEvents: PutEventsRequestEntry[] = events.map((event) => {
      return {
        Detail: JSON.stringify(event.detail),
        DetailType: event.detailType,
        EventBusName: this.eventBusName,
        Source: 'yara-eu-producer',
      };
    });

    const command = new PutEventsCommand({
      Entries: enrichedEvents,
    });
    return await this.client.send(command);
  }
}
