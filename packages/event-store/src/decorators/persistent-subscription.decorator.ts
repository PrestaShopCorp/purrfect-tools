import { applyDecorators, SetMetadata } from '@nestjs/common';

import { METADATA_PERSISTENT_SUBSCRIPTION } from '../constants';
import { EventStorePersistentSubscriptionDescriptor } from '../types';

export function PersistentSubscription(descriptor?: EventStorePersistentSubscriptionDescriptor): ClassDecorator {
  return applyDecorators(SetMetadata(METADATA_PERSISTENT_SUBSCRIPTION, descriptor || {}));
}
