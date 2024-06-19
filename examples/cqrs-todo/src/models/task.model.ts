import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { v4 } from 'uuid';

import { CreateTaskDto } from '../dto';

export class Task {
  @IsUUID()
  public id: string;

  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @IsOptional()
  public description: string = '';

  @IsBoolean()
  public completed: boolean = false;

  static fromCreateTaskDto(dto: CreateTaskDto) {
    const task = plainToInstance(Task, dto);
    task.id = v4();

    return task;
  }
}
