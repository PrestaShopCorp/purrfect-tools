import { CustomStreamMetadata, StreamMetadata } from '@eventstore/db-client/dist/streams/utils/streamMetadata';
import { SetStreamMetadataOptions } from '@eventstore/db-client';

export interface StreamEventPublisherDescriptor<CustomMetadata extends CustomStreamMetadata = CustomStreamMetadata> {
  stream?: string;
  metadata?: StreamMetadata<CustomMetadata>;
  options?: SetStreamMetadataOptions;
}
