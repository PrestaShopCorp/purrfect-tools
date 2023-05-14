import { SubscribeToAllOptions, SubscribeToStreamOptions } from '@eventstore/db-client';
import { ReadableOptions } from 'stream';

export type EventStoreCatchUpSubscriptionToAllDescriptor = {
  configuration?: SubscribeToAllOptions;
  options?: SubscribeToAllOptions;
  readableOptions?: ReadableOptions;
};

export type EventStoreCatchUpSubscriptionToStreamDescriptor = {
  stream: string;
  configuration?: SubscribeToStreamOptions;
  readableOptions?: ReadableOptions;
};

export type EventStoreCatchUpSubscriptionDescriptor =
  | EventStoreCatchUpSubscriptionToAllDescriptor
  | EventStoreCatchUpSubscriptionToStreamDescriptor;
