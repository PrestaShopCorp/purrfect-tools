import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CreateTaskCommand, DeleteTaskCommand, UpdateTaskCommand } from '../commands';
import { GetTaskQuery, GetTasksQuery } from '../queries';
import { CreateTaskDto, DeleteTaskDto, UpdateTaskDto } from '../dto';

@Controller('task')
export class AppController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    await this.commandBus.execute(new CreateTaskCommand(createTaskDto));
  }

  @Patch()
  async updateTask(@Body() updateTaskDto: UpdateTaskDto) {
    await this.commandBus.execute(new UpdateTaskCommand(updateTaskDto));
  }

  @Delete()
  async deleteTask(@Body() deleteTaskDto: DeleteTaskDto) {
    await this.commandBus.execute(new DeleteTaskCommand(deleteTaskDto));
  }

  @Get('/:id')
  getTask(@Param('id') id: string) {
    const query = new GetTaskQuery();
    query.id = id;

    return this.queryBus.execute(query);
  }

  @Get()
  getTasks() {
    return this.queryBus.execute(new GetTasksQuery());
  }
}
