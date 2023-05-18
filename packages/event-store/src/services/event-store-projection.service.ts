import { EventStoreDBClient } from '@eventstore/db-client';
import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { sanitizeClassName } from '@purrfect-tools/common';
import { EVENT_STORE_CLIENT } from '@purrfect-tools/event-store-client';

import { EventStoreProjectionDescriptor } from '../types';
import { EventStoreProjectionSubsystemExplorer } from './explorers/event-store-projection-subsystem.explorer';

@Injectable()
export class EventStoreProjectionService implements OnApplicationBootstrap {
  private readonly logger = new Logger(EventStoreProjectionService.name);

  constructor(
    @Inject(EVENT_STORE_CLIENT)
    protected readonly client: EventStoreDBClient,
    protected readonly explorer: EventStoreProjectionSubsystemExplorer,
  ) {}

  async onApplicationBootstrap() {
    for (const { instance, metadata } of this.explorer.projections) {
      const projectionName = metadata.name || sanitizeClassName(instance);

      this.logger.debug(`Loading '${projectionName}' projection...`);
      await this.loadProjection(projectionName, instance.getQuery(), metadata.configuration);
      this.logger.log(`'${projectionName}' projection was loaded`);
    }
  }

  async loadProjection(
    name: EventStoreProjectionDescriptor['name'],
    query: string,
    configuration?: EventStoreProjectionDescriptor['configuration'],
  ) {
    const status = !!(await this.client
      .getProjectionStatus(name)
      // GRCP for projections is incomplete
      // Tracking issue: https://github.com/EventStore/EventStore/issues/2732
      .catch(() => false));

    if (!status) {
      this.logger.debug(`Creating '${name}' projection...`, configuration);
      await this.client.createProjection(name, '', configuration);
    }

    this.logger.debug(`Updating '${name}' projection...`, query, configuration);
    await this.client.updateProjection(name, query, configuration);
  }
}
