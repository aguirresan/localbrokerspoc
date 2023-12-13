import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';

import {
  EVENT_HANDLER_REFLECT_KEY,
  SHARED_QUEUE_INTERNAL_NAME,
} from './events.static';

type EventName = string;

@Injectable()
export class EventsRouterService implements OnApplicationBootstrap {
  protected handlerMap: Record<EventName, ((event: unknown) => unknown)[]> = {};

  constructor(private readonly discoveryService: DiscoveryService) {}

  async onApplicationBootstrap() {
    const allHandlers =
      await this.discoveryService.methodsAndControllerMethodsWithMetaAtKey<
        string[]
      >(EVENT_HANDLER_REFLECT_KEY);
    this.handlerMap = allHandlers.reduce(
      (
        acc: Record<EventName, ((event: unknown) => unknown)[]>,
        { meta: eventNames, discoveredMethod },
      ) => {
        for (const eventName of eventNames) {
          const handlers = acc[eventName];
          if (handlers) {
            handlers.push(discoveredMethod.handler);
          } else {
            acc[eventName] = [discoveredMethod.handler];
          }
        }
        return acc;
      },
      {},
    );
  }

  @SqsMessageHandler(SHARED_QUEUE_INTERNAL_NAME)
  public async genericEventHandler({
    eventName,
    detail,
  }: {
    eventName: EventName;
    detail: unknown;
  }) {
    const handlers = this.handlerMap[eventName];
    if (handlers) {
      await Promise.all(handlers.map((handler) => handler(detail)));
    }
  }
}
