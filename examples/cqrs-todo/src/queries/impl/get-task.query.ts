import { PickType } from '@nestjs/swagger';

import { Task } from '../../models/task.model';

export class GetTaskQuery extends PickType(Task, ['id']) {}
