import {
  EventStoreDBClient,
  PersistentAction,
  PersistentSubscriptionToAll,
  PersistentSubscriptionToAllResolvedEvent,
  PersistentSubscriptionToStream,
  PersistentSubscriptionToStreamResolvedEvent,
} from '@eventstore/db-client';
import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { sanitizeClassName } from '@purrfect-tools/common';
import { EVENT_STORE_CLIENT } from '@purrfect-tools/event-store-client';

import {
  DEFAULT_PERSISTENT_SUBSCRIPTION_TO_ALL_CONFIG,
  DEFAULT_PERSISTENT_SUBSCRIPTION_TO_STREAM_CONFIG,
} from '../config/default-persistent-subscription.config';
import {
  EventStorePersistentSubscription,
  EventStorePersistentSubscriptionToAllDescriptor,
  EventStorePersistentSubscriptionToStreamDescriptor,
} from '../types';
import { EventStorePersistentSubscriptionSubsystemExplorer } from './explorers/event-store-persistent-subscription-subsystem.explorer';

@Injectable()
export class EventStorePersistentSubscriptionService implements OnApplicationBootstrap {
  private readonly logger = new Logger(EventStorePersistentSubscriptionService.name);

  constructor(
    @Inject(EVENT_STORE_CLIENT)
    protected readonly client: EventStoreDBClient,
    protected readonly explorer: EventStorePersistentSubscriptionSubsystemExplorer,
  ) {}

  // TODO: Add subscription shutdown
  protected subscriptions: (PersistentSubscriptionToAll | PersistentSubscriptionToStream)[] = [];

  async onApplicationBootstrap() {
    for (const { instance, metadata } of this.explorer.persistentSubscriptions) {
      const subscriptionGroup = metadata.group || sanitizeClassName(instance);

      this.logger.debug(`Loading '${subscriptionGroup}' persistent subscription...`);
      this.logger.verbose(metadata);

      !('stream' in metadata)
        ? await this.loadPersistentSubscriptionToAll(
            subscriptionGroup,
            metadata.configuration,
            metadata.options,
            instance,
          )
        : await this.loadPersistentSubscriptionToStream(
            metadata.stream,
            subscriptionGroup,
            metadata.configuration,
            metadata.options,
            instance,
          );

      this.logger.log(`'${instance.constructor.name}/${subscriptionGroup}' catch up subscription was loaded`);
    }
  }

  protected handleEventDebug(
    stream: EventStorePersistentSubscriptionToStreamDescriptor['stream'],
    group:
      | EventStorePersistentSubscriptionToAllDescriptor['group']
      | EventStorePersistentSubscriptionToStreamDescriptor['group'],
    resolvedEvent: PersistentSubscriptionToAllResolvedEvent | PersistentSubscriptionToStreamResolvedEvent,
  ) {
    const { metadata: _me, data: _de, ...event } = resolvedEvent.event;
    const { metadata: _ml, data: _dl, ...link } = resolvedEvent.link || {};

    this.logger.debug(`Event received from '${stream}/${group}' persistent subscription`);
    this.logger.verbose(event, link);
  }

  protected handleEventErrorDebug(
    stream: EventStorePersistentSubscriptionToStreamDescriptor['stream'],
    group:
      | EventStorePersistentSubscriptionToAllDescriptor['group']
      | EventStorePersistentSubscriptionToStreamDescriptor['group'],
    resolvedEvent: PersistentSubscriptionToAllResolvedEvent | PersistentSubscriptionToStreamResolvedEvent,
    e: Error,
  ) {
    const { metadata: _me, data: _de, ...event } = resolvedEvent.event;
    const { metadata: _ml, data: _dl, ...link } = resolvedEvent.link || {};

    this.logger.warn(`Error '${e.constructor.name}' received from '${stream}/${group}' persistent subscription.`);
    this.logger.error(e, e.stack);
    this.logger.verbose(event, link);
  }

  protected async handleEventStoreError(
    stream: EventStorePersistentSubscriptionToStreamDescriptor['stream'],
    group:
      | EventStorePersistentSubscriptionToAllDescriptor['group']
      | EventStorePersistentSubscriptionToStreamDescriptor['group'],
    e: Error,
  ) {
    this.logger.error(
      `EventStore error '${e.constructor.name}' received from '${stream}/${group}' persistent subscription.`,
    );
    this.logger.error(e, e.stack);

    // TODO: Add native ES error handlers (ES Disconnection)
    //   Use an explorer to obtain a decorated service that defines the logic to be followed in case of native ES error.
  }

  protected async handleEvent(
    subscription: PersistentSubscriptionToAll | PersistentSubscriptionToStream,
    handler: EventStorePersistentSubscription | EventStorePersistentSubscription['handleEvent'],
    resolvedEvent: PersistentSubscriptionToAllResolvedEvent | PersistentSubscriptionToStreamResolvedEvent,
  ) {
    const eventHandler = 'handleEvent' in handler ? handler.handleEvent.bind(this) : handler;

    let ack = false;
    let nack = false;

    await eventHandler({
      ...resolvedEvent,
      ack: () => {
        ack = true;
        return subscription.ack(resolvedEvent);
      },
      nack: (action: PersistentAction, reason: string) => {
        nack = true;
        return subscription.nack(action, reason, resolvedEvent);
      },
    });

    // This logic (and the ack/nack logic) must be moved out to superior level.
    // try {} catch (e) {
    //   this.logger.error(e, e.stack);
    //   // TODO: Define handler error management
    //   if (ack ? !nack : nack) {
    //     // TODO: Warning, event not ack or ack and nack at the same time / or promise with ack / nack not returned
    //     // TODO: Add class name on log message to help user to detect this case
    //   }
    // }
  }

  async loadPersistentSubscriptionToAll(
    group: EventStorePersistentSubscriptionToAllDescriptor['group'],
    configuration: EventStorePersistentSubscriptionToAllDescriptor['configuration'],
    options: EventStorePersistentSubscriptionToAllDescriptor['options'],
    handler: EventStorePersistentSubscription | EventStorePersistentSubscription['handleEvent'],
  ) {
    const status = !!(await this.client.getPersistentSubscriptionToAllInfo(group).catch(() => false));

    if (!status) {
      await this.client.createPersistentSubscriptionToAll(
        group,
        {
          ...DEFAULT_PERSISTENT_SUBSCRIPTION_TO_ALL_CONFIG,
          ...configuration,
        },
        options,
      );
    }

    const subscription = this.client.subscribeToPersistentSubscriptionToAll(group, options);

    this.subscriptions.push(subscription);
    subscription.on('data', (resolvedEvent) => {
      this.handleEventDebug('$all', group, resolvedEvent);

      try {
        this.handleEvent(subscription, handler, resolvedEvent);
      } catch (e) {
        this.handleEventErrorDebug('$all', group, resolvedEvent, e);
      }
    });

    subscription.on('error', (e) => this.handleEventStoreError('$all', group, e));
  }

  async loadPersistentSubscriptionToStream(
    stream: EventStorePersistentSubscriptionToStreamDescriptor['stream'],
    group: EventStorePersistentSubscriptionToStreamDescriptor['group'],
    configuration: EventStorePersistentSubscriptionToStreamDescriptor['configuration'],
    options: EventStorePersistentSubscriptionToStreamDescriptor['options'],
    handler: EventStorePersistentSubscription | EventStorePersistentSubscription['handleEvent'],
  ) {
    const status = !!(await this.client.getPersistentSubscriptionToStreamInfo(stream, group).catch(() => false));

    if (!status) {
      await this.client.createPersistentSubscriptionToStream(
        stream,
        group,
        {
          ...DEFAULT_PERSISTENT_SUBSCRIPTION_TO_STREAM_CONFIG,
          ...configuration,
        },
        options,
      );
    }

    const subscription = this.client.subscribeToPersistentSubscriptionToStream(stream, group, options);

    this.subscriptions.push(subscription);
    subscription.on('data', (resolvedEvent) => {
      this.handleEventDebug(stream, group, resolvedEvent);

      try {
        this.handleEvent(subscription, handler, resolvedEvent);
      } catch (e) {
        this.handleEventErrorDebug(stream, group, resolvedEvent, e);
      }
    });

    subscription.on('error', (e) => this.handleEventStoreError(stream, group, e));
  }
}
