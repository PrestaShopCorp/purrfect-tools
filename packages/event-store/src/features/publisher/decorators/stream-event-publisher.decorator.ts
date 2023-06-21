import { applyDecorators, SetMetadata } from '@nestjs/common';

import { METADATA_STREAM_EVENT_PUBLISHER } from '../constants';
import { StreamEventPublisherDescriptor } from '../types';

export function StreamEventPublisher(stream: StreamEventPublisherDescriptor);
export function StreamEventPublisher(category: string);

export function StreamEventPublisher(streamOrDescriptor?: StreamEventPublisherDescriptor | string): ClassDecorator {
  return applyDecorators(
    SetMetadata<typeof METADATA_STREAM_EVENT_PUBLISHER, StreamEventPublisherDescriptor>(
      METADATA_STREAM_EVENT_PUBLISHER,
      typeof streamOrDescriptor === 'string' ? { stream: streamOrDescriptor } : streamOrDescriptor,
    ),
  );
}
