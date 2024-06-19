import { PickType } from '@nestjs/swagger';
import { Task } from '../models/task.model';

export class DeleteTaskDto extends PickType(Task, ['id']) {}
