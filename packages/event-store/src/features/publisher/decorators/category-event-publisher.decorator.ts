import { applyDecorators, SetMetadata } from '@nestjs/common';

import { METADATA_CATEGORY_EVENT_PUBLISHER } from '../constants';
import { CategoryEventPublisherDescriptor } from '../types';

export function CategoryEventPublisher(descriptor: CategoryEventPublisherDescriptor);
export function CategoryEventPublisher(category: string);

export function CategoryEventPublisher(
  categoryOrDescriptor?: CategoryEventPublisherDescriptor | string,
): ClassDecorator {
  return applyDecorators(
    SetMetadata<typeof METADATA_CATEGORY_EVENT_PUBLISHER, CategoryEventPublisherDescriptor>(
      METADATA_CATEGORY_EVENT_PUBLISHER,
      typeof categoryOrDescriptor === 'string' ? { category: categoryOrDescriptor } : categoryOrDescriptor,
    ),
  );
}
