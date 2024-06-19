import { CreateTaskDto } from '../../dto';

export class CreateTaskCommand {
  constructor(public readonly createTaskDto: CreateTaskDto) {}
}
