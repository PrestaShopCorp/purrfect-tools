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

  onModuleInit() {
    this.catchUpSubscriptions.push(
      ...this.metadataAccessor.mapToMetadataWrapper<
        EventStoreCatchUpSubscription,
        EventStoreCatchUpSubscriptionDescriptor
      >(this.discoveryService.getProviders(), METADATA_CATCH_UP_SUBSCRIPTION),
    );

    this.logger.debug(
      `${this.catchUpSubscriptions.length} catch up subscriptions were found using the '${METADATA_CATCH_UP_SUBSCRIPTION}' metadata tag`,
    );

    Object.freeze(this.catchUpSubscriptions);
  }
}
