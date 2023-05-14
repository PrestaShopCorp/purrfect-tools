import {
  ChannelCredentialOptions,
  DNSClusterOptions,
  GossipClusterOptions,
  SingleNodeOptions,
} from '@eventstore/db-client/dist/Client';
import { Credentials } from '@eventstore/db-client/dist/types';
import { EventStoreDBClient } from '@eventstore/db-client';
import { AnonymousProvider } from '@purrfect-tools/common';

export interface EventStoreExistingClientConfig {
  client: EventStoreDBClient;
}

export interface EventStoreConnectionStringClientConfig {
  connectionString: TemplateStringsArray | string;
  parts?: Array<string | number | boolean>;
}

export interface EventStoreConnectionSettings {
  connectionSettings: DNSClusterOptions | GossipClusterOptions | SingleNodeOptions;
  channelCredentials?: ChannelCredentialOptions;
  defaultUserCredentials?: Credentials;
}

export type EventStoreClientConfig =
  | EventStoreExistingClientConfig
  | EventStoreConnectionStringClientConfig
  | EventStoreConnectionSettings;

export type EventStoreClientConfigAsync = AnonymousProvider<EventStoreClientConfig>;
