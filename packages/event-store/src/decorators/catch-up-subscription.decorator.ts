import { applyDecorators, SetMetadata } from '@nestjs/common';

import { METADATA_CATCH_UP_SUBSCRIPTION } from '../constants';
import { EventStoreCatchUpSubscriptionDescriptor } from '../types';

export function CatchUpSubscription();
export function CatchUpSubscription(descriptor: EventStoreCatchUpSubscriptionDescriptor);
export function CatchUpSubscription(stream: string);

export function CatchUpSubscription(
  descriptorOrStream?: EventStoreCatchUpSubscriptionDescriptor | string,
): ClassDecorator {
  return applyDecorators(
    SetMetadata<typeof METADATA_CATCH_UP_SUBSCRIPTION, EventStoreCatchUpSubscriptionDescriptor>(
      METADATA_CATCH_UP_SUBSCRIPTION,
      typeof descriptorOrStream === 'string' ? { stream: descriptorOrStream } : descriptorOrStream || {},
    ),
  );
}
