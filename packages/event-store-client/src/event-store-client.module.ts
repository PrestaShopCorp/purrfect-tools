import { EventStoreDBClient } from '@eventstore/db-client';
import { DynamicModule, Module } from '@nestjs/common';
import { fetchProvider } from '@purrfect-tools/common';

import { EVENT_STORE_CLIENT, EVENT_STORE_CONFIG } from './constants';
import { EventStoreClientConfig, EventStoreClientConfigAsync } from './types';

// TODO: Check a proper way to dispose the connection
const BuildModule = (config: EventStoreClientConfigAsync): DynamicModule => {
  const cfg = fetchProvider(config);

  return {
    module: EventStoreClientModule,
    providers: [
      {
        provide: EVENT_STORE_CONFIG,
        ...cfg,
      },
      {
        provide: EVENT_STORE_CLIENT,
        inject: [EVENT_STORE_CONFIG],
        useFactory: (config: EventStoreClientConfig) =>
          'client' in config
            ? config.client
            : 'connectionString' in config
            ? EventStoreDBClient.connectionString(config.connectionString, ...(config.parts || []))
            : new EventStoreDBClient(
                config.connectionSettings as any,
                config.channelCredentials,
                config.defaultUserCredentials,
              ),
      },
    ],
    exports: [EVENT_STORE_CLIENT],
  };
};

@Module({})
export class EventStoreClientModule {
  static register(config: EventStoreClientConfig) {
    return BuildModule({ useValue: config });
  }

  static registerAsync(config: EventStoreClientConfigAsync) {
    return BuildModule(config);
  }
}
