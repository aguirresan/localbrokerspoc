import { DynamicModule, InjectionToken, Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { SQSClient } from '@aws-sdk/client-sqs';

import { fromIni } from '@aws-sdk/credential-providers';

import { EventsRouterService } from './events-router.service';
import { SHARED_QUEUE_INTERNAL_NAME } from './events.static';

interface EventsModuleConfig {
  queueUrl: string;
}

@Module({})
export class EventsModule {
  private static readonly EVENTS_MODULE_CONFIG = Symbol('EVENTS_MODULE_CONFIG');

  registerAsync({
    inject,
    useFactory,
  }: {
    inject: InjectionToken[];
    useFactory: (...args: unknown[]) => EventsModuleConfig;
  }): DynamicModule {
    return {
      module: EventsModule,
      providers: [
        {
          inject,
          provide: EventsModule.EVENTS_MODULE_CONFIG,
          useFactory,
        },
        EventsRouterService,
      ],
      imports: [
        SqsModule.registerAsync({
          useFactory: ({ queueUrl }: EventsModuleConfig) => {
            const sqsClient = new SQSClient({
              endpoint: 'http://localhost:4566',
              region: 'us-east-1',
              credentials: fromIni({ profile: 'localstack' }),
            });

            console.log('Inside register async');
            console.log(`queueUrl: ${queueUrl}`);

            return {
              consumers: [
                {
                  name: SHARED_QUEUE_INTERNAL_NAME,
                  queueUrl,
                  region: 'eu-west-1',
                  sqs: sqsClient,
                  terminateGracefully: true,
                },
              ],
            };
          },
          inject: [EventsModule.EVENTS_MODULE_CONFIG],
        }),
      ],
    };
  }
}
