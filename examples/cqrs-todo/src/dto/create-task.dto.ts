import { OmitType } from '@nestjs/swagger';
import { Task } from '../models/task.model';

export class CreateTaskDto extends OmitType(Task, ['id', 'completed']) {}
