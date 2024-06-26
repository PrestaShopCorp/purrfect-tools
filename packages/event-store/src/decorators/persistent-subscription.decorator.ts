import { applyDecorators, SetMetadata } from '@nestjs/common';

import { METADATA_PERSISTENT_SUBSCRIPTION } from '../constants';
import {
  EventStorePersistentSubscriptionDescriptor,
  EventStorePersistentSubscriptionToAllDescriptor,
  EventStorePersistentSubscriptionToStreamDescriptor,
} from '../types';

export function PersistentSubscription(): ClassDecorator;
export function PersistentSubscription(descriptor: EventStorePersistentSubscriptionToAllDescriptor): ClassDecorator;
export function PersistentSubscription(descriptor: EventStorePersistentSubscriptionToStreamDescriptor): ClassDecorator;
export function PersistentSubscription(stream: string): ClassDecorator;
export function PersistentSubscription(stream: string, group: string): ClassDecorator;

export function PersistentSubscription(
  descriptorOrStream?: EventStorePersistentSubscriptionDescriptor | string,
  group?: string,
): ClassDecorator {
  return applyDecorators(
    SetMetadata<typeof METADATA_PERSISTENT_SUBSCRIPTION, EventStorePersistentSubscriptionDescriptor>(
      METADATA_PERSISTENT_SUBSCRIPTION,
      typeof descriptorOrStream === 'string' ? { stream: descriptorOrStream, group } : descriptorOrStream || {},
    ),
  );
}
