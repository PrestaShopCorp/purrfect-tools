import { CustomStreamMetadata, StreamMetadata } from '@eventstore/db-client/dist/streams/utils/streamMetadata';
import { SetStreamMetadataOptions } from '@eventstore/db-client';

export interface CategoryEventPublisherDescriptor<CustomMetadata extends CustomStreamMetadata = CustomStreamMetadata> {
  category?: string;
  metadata?: StreamMetadata<CustomMetadata>;
  options?: SetStreamMetadataOptions;
}
