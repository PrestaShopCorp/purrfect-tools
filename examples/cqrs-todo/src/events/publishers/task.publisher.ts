import { EventStoreDBClient } from '@eventstore/db-client';
import { Inject, Injectable } from '@nestjs/common';
import { EVENT_STORE_CLIENT } from '@purrfect-tools/event-store-client';
import { plainToInstance } from 'class-transformer';

import { toJsonEvent } from '../../../utils/to-json-event.util';
import { Task } from '../../models/task.model';
import { CreateTaskEvent } from '../impl/create-task.event';
import { UpdateTaskEvent } from '../impl/update-task.event';
import { DeleteTaskEvent } from '../impl/delete-task.event';
import { DeleteTaskDto, UpdateTaskDto } from '../../dto';

@Injectable()
export class TaskPublisher {
  constructor(@Inject(EVENT_STORE_CLIENT) private readonly esClient: EventStoreDBClient) {}

  private async publish(event: CreateTaskEvent | UpdateTaskEvent | DeleteTaskEvent) {
    const { id } = event;
    const stream = `task-${id}`;
    return await this.esClient.appendToStream(stream, toJsonEvent(event));
  }

  async create(task: Task) {
    const event = plainToInstance(CreateTaskEvent, task);
    return await this.publish(event);
  }

  async update(updateDto: UpdateTaskDto) {
    const event = plainToInstance(UpdateTaskEvent, updateDto);
    return await this.publish(event);
  }

  async delete(deleteDto: DeleteTaskDto) {
    const event = plainToInstance(DeleteTaskEvent, deleteDto);
    return await this.publish(event);
  }
}
