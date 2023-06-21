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

import { METADATA_CATEGORY_EVENT_PUBLISHER } from '../constants';
import { CategoryEventPublisherDescriptor } from '../types';

export abstract class AbstractCategoryEventPublisherService {
  protected readonly logger;

  protected readonly descriptor: CategoryEventPublisherDescriptor;

  protected constructor(
    @Inject(EVENT_STORE_CLIENT)
    protected readonly client: EventStoreDBClient,
  ) {
    this.logger = new Logger(this.constructor.name);
    this.descriptor = Reflect.getMetadata(METADATA_CATEGORY_EVENT_PUBLISHER, this);

    if (!this.descriptor) {
      this.logger.warn(
        `The service '${this.constructor.name}' won't work, '${this.constructor.name}' must be decorated with the 'EventPublisher' decorator`,
      );
    }
  }

  private async upsertMedatada(stream: string) {
    const { metadata, options } = this.descriptor;
    const { metadata: existingMetadata } = await this.client.getStreamMetadata(stream);

    if (!isEqual(metadata, existingMetadata)) {
      return this.client.setStreamMetadata(stream, metadata, options);
    }
  }

  async publish(
    id: string,
    events: JSONEventOptions<JSONEventType> | JSONEventOptions<JSONEventType>[],
    options?: AppendToStreamOptions,
  ) {
    if (!this.descriptor) return;

    const { category } = this.descriptor;
    const stream = `${category}-${id}`;
    const evts = Array.isArray(events) ? events.map(jsonEvent) : [jsonEvent(events)];

    await this.upsertMedatada(stream);
    return this.client.appendToStream(stream, evts, options);
  }
}
