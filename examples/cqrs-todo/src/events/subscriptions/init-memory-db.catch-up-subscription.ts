import { END, EventStoreDBClient, FORWARDS, JSONType, ResolvedEvent, START } from '@eventstore/db-client';
import { Inject, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CatchUpSubscription, EventStoreCatchUpSubscription } from '@purrfect-tools/event-store';
import { EVENT_STORE_CLIENT } from '@purrfect-tools/event-store-client';
import { plainToInstance } from 'class-transformer';

import { Task } from '../../models/task.model';
import { MemoryDbService } from '../../services/memory-db.service';
import { CreateTaskEvent } from '../impl/create-task.event';
import { UpdateTaskEvent } from '../impl/update-task.event';
import { DeleteTaskEvent } from '../impl/delete-task.event';

@CatchUpSubscription({
  stream: '$ce-task',
  configuration: {
    fromRevision: END,
    resolveLinkTos: true,
  },
})
export class InitMemoryDbCatchUpSubscription implements OnApplicationBootstrap, EventStoreCatchUpSubscription {
  private readonly logger = new Logger(InitMemoryDbCatchUpSubscription.name);

  constructor(
    @Inject(EVENT_STORE_CLIENT) private readonly esClient: EventStoreDBClient,
    private memoryDb: MemoryDbService,
  ) {}

  async onApplicationBootstrap() {
    const events = this.esClient.readStream('$ce-task', {
      fromRevision: START,
      resolveLinkTos: true,
      direction: FORWARDS,
    });

    for await (const resolvedEvent of events) {
      this.processEvent(resolvedEvent);
    }
  }

  private processEvent({ event }: ResolvedEvent) {
    if (!event.isJson) return;

    const { data, type } = event;

    switch (type) {
      case CreateTaskEvent.name: {
        const task = plainToInstance(Task, data);
        this.memoryDb.set(task.id, task);
        break;
      }
      case UpdateTaskEvent.name: {
        const event = plainToInstance(UpdateTaskEvent, data);

        const task = this.memoryDb.get(event.id);
        Object.assign(task, event);

        this.memoryDb.set(task.id, task);
        break;
      }
      case DeleteTaskEvent.name: {
        const event = plainToInstance(DeleteTaskEvent, data);
        this.memoryDb.delete(event.id);
        break;
      }
    }
  }

  handleEvent(resolvedEvent: ResolvedEvent) {
    this.logger.log(`Received event ${resolvedEvent}`);
    this.processEvent(resolvedEvent);
  }
}
