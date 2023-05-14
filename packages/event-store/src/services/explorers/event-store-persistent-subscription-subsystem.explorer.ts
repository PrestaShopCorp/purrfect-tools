import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, ModuleRef } from '@nestjs/core';
import { MetadataAccessor, MetadataWrapper } from '@purrfect-tools/common';

import { METADATA_PERSISTENT_SUBSCRIPTION } from '../../constants';
import { EventStorePersistentSubscription, EventStorePersistentSubscriptionDescriptor } from '../../types';

@Injectable()
export class EventStorePersistentSubscriptionSubsystemExplorer implements OnModuleInit {
  private readonly logger = new Logger(EventStorePersistentSubscriptionSubsystemExplorer.name);

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly discoveryService: DiscoveryService,

    private readonly metadataAccessor: MetadataAccessor,
  ) {}

  readonly persistentSubscriptions: MetadataWrapper<
    EventStorePersistentSubscription,
    EventStorePersistentSubscriptionDescriptor
  >[] = [];

  isValidService(instance: EventStorePersistentSubscription) {
    const hasHandleEvent = 'handleEvent' in instance;

    if (!hasHandleEvent) {
      const serviceName = (instance as unknown).constructor.name;
      this.logger.warn(
        `The service '${serviceName}' won't be auto-loaded, '${serviceName}' doesn't implement 'EventStorePersistentSubscription' interface properly.`,
      );
    }

    return hasHandleEvent;
  }

  onModuleInit() {
    this.persistentSubscriptions.push(
      ...this.metadataAccessor
        .mapToMetadataWrapper<EventStorePersistentSubscription, EventStorePersistentSubscriptionDescriptor>(
          this.discoveryService.getProviders(),
          METADATA_PERSISTENT_SUBSCRIPTION,
        )
        .filter(({ instance }) => this.isValidService(instance)),
    );

    this.logger.debug(
      `${this.persistentSubscriptions.length} persistent subscriptions were found using the '${METADATA_PERSISTENT_SUBSCRIPTION}' metadata tag`,
    );

    Object.freeze(this.persistentSubscriptions);
  }
}
