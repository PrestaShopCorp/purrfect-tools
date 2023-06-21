import { applyDecorators, SetMetadata } from '@nestjs/common';

import { METADATA_PROJECTION } from '../constants';
import { EventStoreProjectionDescriptor } from '../types';

export function Projection();
export function Projection(descriptor: EventStoreProjectionDescriptor);
export function Projection(name: string);

export function Projection(nameOrDescriptor?: EventStoreProjectionDescriptor | string): ClassDecorator {
  return applyDecorators(
    SetMetadata<typeof METADATA_PROJECTION, EventStoreProjectionDescriptor>(
      METADATA_PROJECTION,
      typeof nameOrDescriptor === 'string' ? { name: nameOrDescriptor } : nameOrDescriptor || {},
    ),
  );
}
