import { applyDecorators, SetMetadata } from '@nestjs/common';

import { METADATA_PERSISTENT_SUBSCRIPTION } from '../constants';
import { EventStorePersistentSubscriptionDescriptor } from '../types';

export function PersistentSubscription();
export function PersistentSubscription(descriptor: EventStorePersistentSubscriptionDescriptor);
export function PersistentSubscription(stream: string);
export function PersistentSubscription(stream: string, group: string);

export function PersistentSubscription(
  descriptorOrStream?: EventStorePersistentSubscriptionDescriptor | string,
  group?: string,
): ClassDecorator {
  return applyDecorators(
    SetMetadata(
      METADATA_PERSISTENT_SUBSCRIPTION,
      typeof descriptorOrStream === 'string' ? { stream: descriptorOrStream, group } : descriptorOrStream || {},
    ),
  );
}
