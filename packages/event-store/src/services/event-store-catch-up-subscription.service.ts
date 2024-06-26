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
      this.logger.debug(`Loading '${instance.constructor.name}' catch up subscription...`);
      this.logger.verbose(metadata);

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
    resolvedEvent: AllStreamResolvedEvent | ResolvedEvent,
  ) {
    const { metadata: _me, data: _de, ...event } = resolvedEvent.event;
    const { metadata: _ml, data: _dl, ...link } = resolvedEvent.link || {};

    this.logger.debug(`Event received from '${stream}' catch up subscription`);
    this.logger.verbose(event, link);
  }

  protected handleEventErrorDebug(
    stream: EventStoreCatchUpSubscriptionToStreamDescriptor['stream'],
    resolvedEvent: AllStreamResolvedEvent | ResolvedEvent,
    e: Error,
  ) {
    const { metadata: _me, data: _de, ...event } = resolvedEvent.event;
    const { metadata: _ml, data: _dl, ...link } = resolvedEvent.link || {};

    this.logger.warn(`Error '${e.constructor.name}' received from '${stream}' catch up subscription.`);
    this.logger.error(e, e.stack);
    this.logger.verbose(event, link);
  }

  protected async handleEventStoreError(stream: EventStoreCatchUpSubscriptionToStreamDescriptor['stream'], e: Error) {
    this.logger.error(`EventStore error '${e.constructor.name}' received from '${stream}' catch up subscription.`);
    this.logger.error(e, e.stack);

    // TODO: Add native ES error handlers (ES Disconnection)
    //   Use an explorer to obtain a decorated service that defines the logic to be followed in case of native ES error.
  }

  protected async handleEvent(
    handler: EventStoreCatchUpSubscription | EventStoreCatchUpSubscription['handleEvent'],
    resolvedEvent: AllStreamResolvedEvent | ResolvedEvent,
  ) {
    const eventHandler = 'handleEvent' in handler ? handler.handleEvent.bind(handler) : handler;
    await eventHandler(resolvedEvent);
  }

  async loadCatchUpSubscriptionToAll(
    configuration: EventStoreCatchUpSubscriptionToAllDescriptor['configuration'],
    readableOptions: EventStoreCatchUpSubscriptionToAllDescriptor['readableOptions'],
    handler: EventStoreCatchUpSubscription | EventStoreCatchUpSubscription['handleEvent'],
  ) {
    this.logger.debug(`Subscribing to '$all' catch up subscription...`);
    this.logger.verbose(configuration, readableOptions);

    const subscription = this.client.subscribeToAll(configuration, readableOptions);
    this.subscriptions.push(subscription);
    subscription.on('data', (resolvedEvent) => {
      this.handleEventDebug('$all', resolvedEvent);

      try {
        this.handleEvent(handler, resolvedEvent);
      } catch (e) {
        this.handleEventErrorDebug('$all', resolvedEvent, e);
      }
    });

    subscription.on('error', (e) => this.handleEventStoreError('$all', e));
  }

  async loadCatchUpSubscriptionToStream(
    stream: EventStoreCatchUpSubscriptionToStreamDescriptor['stream'],
    configuration: EventStoreCatchUpSubscriptionToStreamDescriptor['configuration'],
    readableOptions: EventStoreCatchUpSubscriptionToStreamDescriptor['readableOptions'],
    handler: EventStoreCatchUpSubscription | EventStoreCatchUpSubscription['handleEvent'],
  ) {
    this.logger.debug(`Subscribing to '${stream}' catch up subscription...`);
    this.logger.verbose(configuration, readableOptions);

    const subscription = this.client.subscribeToStream(stream, configuration, readableOptions);

    this.subscriptions.push(subscription);
    subscription.on('data', (resolvedEvent) => {
      this.handleEventDebug(stream, resolvedEvent);

      try {
        this.handleEvent(handler, resolvedEvent);
      } catch (e) {
        this.handleEventErrorDebug(stream, resolvedEvent, e);
      }
    });

    subscription.on('error', (e) => this.handleEventStoreError(stream, e));
  }
}
