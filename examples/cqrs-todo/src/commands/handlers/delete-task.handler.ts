import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger, NotFoundException } from '@nestjs/common';

import { DeleteTaskCommand } from '../impl/delete-task.command';
import { TaskPublisher } from '../../events/publishers';
import { MemoryDbService } from '../../services/memory-db.service';

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  private readonly logger = new Logger(DeleteTaskHandler.name);

  constructor(private readonly memoryDb: MemoryDbService, private readonly publisher: TaskPublisher) {}

  async execute({ deleteTaskDto }: DeleteTaskCommand) {
    if (!this.memoryDb.get(deleteTaskDto.id)) throw new NotFoundException();

    this.logger.log('Delete task', deleteTaskDto);
    return await this.publisher.delete(deleteTaskDto);
  }
}
