import { UpdateTaskDto } from '../../dto';

export class UpdateTaskCommand {
  constructor(public readonly updateTaskDto: UpdateTaskDto) {}
}
