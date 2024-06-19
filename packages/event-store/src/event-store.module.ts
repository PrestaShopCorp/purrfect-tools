import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { MetadataAccessor } from '@purrfect-tools/common';
import {
  EventStoreClientConfig,
  EventStoreClientConfigAsync,
  EventStoreClientModule,
} from '@purrfect-tools/event-store-client';
import {
  EventStoreCatchUpSubscriptionSubsystemExplorer,
  EventStoreCatchUpSubscriptionService,
  EventStorePersistentSubscriptionSubsystemExplorer,
  EventStorePersistentSubscriptionService,
  EventStoreProjectionSubsystemExplorer,
  EventStoreProjectionService,
} from './services';

const BuildModule = (connection: EventStoreClientConfigAsync): DynamicModule => {
  return {
    module: EventStoreModule,
    imports: [DiscoveryModule, EventStoreClientModule.registerAsync(connection)],
    providers: [
      MetadataAccessor,
      EventStoreCatchUpSubscriptionSubsystemExplorer,
      EventStoreCatchUpSubscriptionService,
      EventStorePersistentSubscriptionSubsystemExplorer,
      EventStorePersistentSubscriptionService,
      EventStoreProjectionSubsystemExplorer,
      EventStoreProjectionService,
    ],
    exports: [
      EventStoreClientModule,
      EventStoreCatchUpSubscriptionService,
      EventStorePersistentSubscriptionService,
      EventStoreProjectionService,
    ],
  };
};

@Module({})
export class EventStoreModule {
  static register(connection: EventStoreClientConfig): DynamicModule {
    return BuildModule({ useValue: connection });
  }

  static registerAsync(connection: EventStoreClientConfigAsync) {
    return BuildModule(connection);
  }
}
