import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, ModuleRef } from '@nestjs/core';
import { MetadataAccessor, MetadataWrapper } from '@purrfect-tools/common';

import { METADATA_CATCH_UP_SUBSCRIPTION } from '../../constants';
import { EventStoreCatchUpSubscription, EventStoreCatchUpSubscriptionDescriptor } from '../../types';

@Injectable()
export class EventStoreCatchUpSubscriptionSubsystemExplorer implements OnModuleInit {
  private readonly logger = new Logger(EventStoreCatchUpSubscriptionSubsystemExplorer.name);

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly discoveryService: DiscoveryService,

    private readonly metadataAccessor: MetadataAccessor,
  ) {}

  readonly catchUpSubscriptions: MetadataWrapper<
    EventStoreCatchUpSubscription,
    EventStoreCatchUpSubscriptionDescriptor
  >[] = [];

  isValidService(instance: EventStoreCatchUpSubscription) {
    const hasHandleEvent = 'handleEvent' in instance;

    if (!hasHandleEvent) {
      const serviceName = (instance as unknown).constructor.name;
      this.logger.warn(
        `The service '${serviceName}' won't be auto-loaded, '${serviceName}' doesn't implement 'EventStoreCatchUpSubscription' interface properly`,
      );
    }

    return hasHandleEvent;
  }

  onModuleInit() {
    this.catchUpSubscriptions.push(
      ...this.metadataAccessor
        .mapToMetadataWrapper<EventStoreCatchUpSubscription, EventStoreCatchUpSubscriptionDescriptor>(
          this.discoveryService.getProviders(),
          METADATA_CATCH_UP_SUBSCRIPTION,
        )
        .filter(({ instance }) => this.isValidService(instance)),
    );

    this.logger.debug(
      `${this.catchUpSubscriptions.length} catch up subscriptions were found using the '${METADATA_CATCH_UP_SUBSCRIPTION}' metadata tag`,
    );

    Object.freeze(this.catchUpSubscriptions);
  }
}
