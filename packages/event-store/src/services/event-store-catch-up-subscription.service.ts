import {
  AllStreamResolvedEvent,
  AllStreamSubscription,
  EventStoreDBClient,
  ResolvedEvent,
  StreamSubscription,
} from '@eventstore/db-client';
import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { EVENT_STORE_CLIENT } from '@purrfect-tools/event-store-client';

import {
  EventStoreCatchUpSubscription,
  EventStoreCatchUpSubscriptionToAllDescriptor,
  EventStoreCatchUpSubscriptionToStreamDescriptor,
} from '../types';
import { EventStoreCatchUpSubscriptionSubsystemExplorer } from './explorers/event-store-catch-up-subscription-subsystem.explorer';

@Injectable()
export class EventStoreCatchUpSubscriptionService implements OnApplicationBootstrap {
  private readonly logger = new Logger(EventStoreCatchUpSubscriptionService.name);

  constructor(
    @Inject(EVENT_STORE_CLIENT)
    protected readonly client: EventStoreDBClient,
    protected readonly explorer: EventStoreCatchUpSubscriptionSubsystemExplorer,
  ) {}

  // TODO: Add subscription shutdown
  protected subscriptions: (AllStreamSubscription | StreamSubscription)[] = [];

  async onApplicationBootstrap() {
    for (const { instance, metadata } of this.explorer.catchUpSubscriptions) {
      this.logger.debug(`Loading '${instance.constructor.name}' catch up subscription...`, metadata);
      !('stream' in metadata)
        ? await this.loadCatchUpSubscriptionToAll(metadata.configuration, metadata.readableOptions, instance)
        : await this.loadCatchUpSubscriptionToStream(
            metadata.stream,
            metadata.configuration,
            metadata.readableOptions,
            instance,
          );

      this.logger.log(`'${instance.constructor.name}' catch up subscription was loaded`);
    }
  }

  protected handleEventDebug(
    stream: EventStoreCatchUpSubscriptionToStreamDescriptor['stream'],
    configuration:
      | EventStoreCatchUpSubscriptionToAllDescriptor['configuration']
      | EventStoreCatchUpSubscriptionToStreamDescriptor['configuration'],
    readableOptions:
      | EventStoreCatchUpSubscriptionToAllDescriptor['readableOptions']
      | EventStoreCatchUpSubscriptionToStreamDescriptor['readableOptions'],
    resolvedEvent: AllStreamResolvedEvent | ResolvedEvent,
  ) {
    const { metadata: _me, data: _de, ...event } = resolvedEvent.event;
    const { metadata: _ml, data: _dl, ...link } = resolvedEvent.link || {};

    this.logger.debug(`Event received from '${stream}' catch up subscription`, configuration, readableOptions, {
      event,
      link,
    });
  }

  protected async handleEvent(
    handler: EventStoreCatchUpSubscription | EventStoreCatchUpSubscription['handleEvent'],
    resolvedEvent: AllStreamResolvedEvent | ResolvedEvent,
  ) {
    try {
      const eventHandler = 'handleEvent' in handler ? handler.handleEvent.bind(handler) : handler;
      await eventHandler(resolvedEvent);
    } catch (e) {
      this.logger.error(e, e.stack);
      // TODO: Handle subscription error
      //  Check how to throw this to an exception filter to prevent a crash in the subscriber.
    }
  }

  async loadCatchUpSubscriptionToAll(
    configuration: EventStoreCatchUpSubscriptionToAllDescriptor['configuration'],
    readableOptions: EventStoreCatchUpSubscriptionToAllDescriptor['readableOptions'],
    handler: EventStoreCatchUpSubscription | EventStoreCatchUpSubscription['handleEvent'],
  ) {
    this.logger.debug(`Subscribing to '$all' catch up subscription...`, configuration, readableOptions);
    const subscription = this.client.subscribeToAll(configuration, readableOptions);

    this.subscriptions.push(subscription);
    subscription.on('data', (resolvedEvent) => {
      this.handleEventDebug('$all', configuration, readableOptions, resolvedEvent);
      this.handleEvent(handler, resolvedEvent);
    });

    // TODO: Check what happens on subscription disconnection / retry
  }

  async loadCatchUpSubscriptionToStream(
    stream: EventStoreCatchUpSubscriptionToStreamDescriptor['stream'],
    configuration: EventStoreCatchUpSubscriptionToStreamDescriptor['configuration'],
    readableOptions: EventStoreCatchUpSubscriptionToStreamDescriptor['readableOptions'],
    handler: EventStoreCatchUpSubscription | EventStoreCatchUpSubscription['handleEvent'],
  ) {
    this.logger.debug(`Subscribing to '${stream}' catch up subscription...`, configuration, readableOptions);
    const subscription = this.client.subscribeToStream(stream, configuration, readableOptions);

    this.subscriptions.push(subscription);
    subscription.on('data', (resolvedEvent) => {
      this.handleEventDebug(stream, configuration, readableOptions, resolvedEvent);
      this.handleEvent(handler, resolvedEvent);
    });

    // TODO: Check what happens on subscription disconnection / retry
  }
}
