import {
  AppendToStreamOptions,
  EventStoreDBClient,
  jsonEvent,
  JSONEventOptions,
  JSONEventType,
} from '@eventstore/db-client';
import { Inject, Logger } from '@nestjs/common';
import { EVENT_STORE_CLIENT } from '@purrfect-tools/event-store-client';
import isEqual = require('fast-deep-equal');

import { METADATA_STREAM_EVENT_PUBLISHER } from '../constants';
import { StreamEventPublisherDescriptor } from '../types';

export abstract class AbstractStreamEventPublisherService {
  protected readonly logger;

  protected readonly descriptor: StreamEventPublisherDescriptor;

  private isMetadataUpdated = false;

  protected constructor(
    @Inject(EVENT_STORE_CLIENT)
    protected readonly client: EventStoreDBClient,
  ) {
    this.logger = new Logger(this.constructor.name);
    this.descriptor = Reflect.getMetadata(METADATA_STREAM_EVENT_PUBLISHER, this);

    if (!this.descriptor) {
      this.logger.warn(
        `The service '${this.constructor.name}' won't work, '${this.constructor.name}' must be decorated with the 'EventPublisher' decorator`,
      );
    }
  }

  private async upsertMedatada() {
    const { stream, metadata, options } = this.descriptor;
    const { metadata: existingMetadata } = await this.client.getStreamMetadata(stream);

    if (!isEqual(metadata, existingMetadata)) {
      return this.client.setStreamMetadata(stream, metadata, options);
    }
  }

  async publish(
    events: JSONEventOptions<JSONEventType> | JSONEventOptions<JSONEventType>[],
    options?: AppendToStreamOptions,
  ) {
    if (!this.descriptor) return;
    if (!this.isMetadataUpdated) await this.upsertMedatada();

    const { stream } = this.descriptor;
    const evts = Array.isArray(events) ? events.map(jsonEvent) : [jsonEvent(events)];

    return this.client.appendToStream(stream, evts, options);
  }
}
