import {
  CreatePersistentSubscriptionToAllOptions,
  PersistentSubscriptionToAllSettings,
  PersistentSubscriptionToStreamSettings,
  SubscribeToPersistentSubscriptionToAllOptions,
  SubscribeToPersistentSubscriptionToStreamOptions,
} from '@eventstore/db-client';

export type EventStorePersistentSubscriptionToAllDescriptor = {
  group?: string;
  configuration?: Partial<PersistentSubscriptionToAllSettings>;
  options?: CreatePersistentSubscriptionToAllOptions & SubscribeToPersistentSubscriptionToAllOptions;
};

export type EventStorePersistentSubscriptionToStreamDescriptor = {
  stream: string;
  group?: string;
  configuration?: Partial<PersistentSubscriptionToStreamSettings>;
  options?: SubscribeToPersistentSubscriptionToStreamOptions;
};

export type EventStorePersistentSubscriptionDescriptor =
  | EventStorePersistentSubscriptionToAllDescriptor
  | EventStorePersistentSubscriptionToStreamDescriptor;
