import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateTaskCommand } from '../impl/update-task.command';
import { TaskPublisher } from '../../events/publishers';
import { MemoryDbService } from '../../services/memory-db.service';

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskHandler implements ICommandHandler<UpdateTaskCommand> {
  private readonly logger = new Logger(UpdateTaskHandler.name);

  constructor(private readonly memoryDb: MemoryDbService, private readonly publisher: TaskPublisher) {}

  async execute({ updateTaskDto }: UpdateTaskCommand) {
    if (!this.memoryDb.get(updateTaskDto.id)) throw new NotFoundException();

    // TODO: Validate existing task
    this.logger.log('Delete task', updateTaskDto);
    return await this.publisher.update(updateTaskDto);
  }
}
