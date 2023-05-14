import { applyDecorators, SetMetadata } from '@nestjs/common';

import { METADATA_CATCH_UP_SUBSCRIPTION } from '../constants';
import { EventStoreCatchUpSubscriptionDescriptor } from '../types';

export function CatchUpSubscription(descriptor?: EventStoreCatchUpSubscriptionDescriptor): ClassDecorator {
  return applyDecorators(SetMetadata(METADATA_CATCH_UP_SUBSCRIPTION, descriptor || {}));
}
