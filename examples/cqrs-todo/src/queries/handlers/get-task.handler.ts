import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { MemoryDbService } from '../../services/memory-db.service';
import { GetTaskQuery } from '../impl/get-task.query';

@QueryHandler(GetTaskQuery)
export class GetTaskHandler implements IQueryHandler<GetTaskQuery> {
  constructor(private readonly memoryDb: MemoryDbService) {}

  execute(query: GetTaskQuery) {
    const task = this.memoryDb.get(query.id);
    if (!task) throw new NotFoundException();

    return task;
  }
}
