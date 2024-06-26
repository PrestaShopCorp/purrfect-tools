import { applyDecorators, SetMetadata } from '@nestjs/common';

import { METADATA_CATCH_UP_SUBSCRIPTION } from '../constants';
import {
  EventStoreCatchUpSubscriptionDescriptor,
  EventStoreCatchUpSubscriptionToAllDescriptor,
  EventStoreCatchUpSubscriptionToStreamDescriptor,
} from '../types';

export function CatchUpSubscription(): ClassDecorator;
export function CatchUpSubscription(descriptor: EventStoreCatchUpSubscriptionToAllDescriptor): ClassDecorator;
export function CatchUpSubscription(descriptor: EventStoreCatchUpSubscriptionToStreamDescriptor): ClassDecorator;
export function CatchUpSubscription(stream: string): ClassDecorator;

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
