import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { MemoryDbService } from '../../services/memory-db.service';
import { GetTasksQuery } from '../impl/get-tasks.query';

@QueryHandler(GetTasksQuery)
export class GetTasksHandler implements IQueryHandler<GetTasksQuery> {
  constructor(private readonly memoryDb: MemoryDbService) {}

  execute(query: GetTasksQuery): any {
    return this.memoryDb.db;
  }
}
