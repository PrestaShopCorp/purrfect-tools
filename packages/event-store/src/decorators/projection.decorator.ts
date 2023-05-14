import { applyDecorators, SetMetadata } from '@nestjs/common';

import { METADATA_PROJECTION } from '../constants';
import { EventStoreProjectionDescriptor } from '../types';

export function Projection(descriptor?: EventStoreProjectionDescriptor): ClassDecorator {
  return applyDecorators(SetMetadata(METADATA_PROJECTION, descriptor || {}));
}
