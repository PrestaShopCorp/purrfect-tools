import { DeleteTaskDto } from '../../dto';

export class DeleteTaskCommand {
  constructor(public readonly deleteTaskDto: DeleteTaskDto) {}
}
