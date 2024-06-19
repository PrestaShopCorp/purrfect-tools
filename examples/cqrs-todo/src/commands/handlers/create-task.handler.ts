import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { inspect } from 'node:util';

import { TaskPublisher } from '../../events/publishers';
import { Task } from '../../models/task.model';
import { CreateTaskCommand } from '../impl/create-task.command';

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  private readonly logger = new Logger(CreateTaskHandler.name);

  constructor(private readonly publisher: TaskPublisher) {}

  async execute({ createTaskDto }: CreateTaskCommand) {
    const task = Task.fromCreateTaskDto(createTaskDto);

    this.logger.log('Create task', inspect(task));
    return await this.publisher.create(task);
  }
}
