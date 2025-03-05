import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Create task' })
  @Post('project/:project_id/task')
  create(
    @Param('project_id') project_id: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.taskService.create(+project_id, createTaskDto);
  }

  @ApiOperation({ summary: 'Get all tasks' })
  @ApiQuery({ name: 'page', example: 1 })
  @ApiQuery({ name: 'size', example: 10 })
  @Get('project/:project_id/task')
  findAll(
    @Param('project_id') project_id: number,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ) {
    return this.taskService.findAll(+project_id, +page, +size);
  }

  @ApiOperation({ summary: 'Get task by id' })
  @Get('project/:project_id/task/:task_id')
  findOne(
    @Param('project_id') project_id: number,
    @Param('task_id') task_id: string,
  ) {
    return this.taskService.findOne(+project_id, +task_id);
  }

  @ApiOperation({ summary: 'Edit task' })
  @Patch('project/:project_id/task/:task_id')
  update(
    @Param('project_id') project_id: number,
    @Param('task_id') task_id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(+project_id, +task_id, updateTaskDto);
  }

  @ApiOperation({ summary: 'Delete Task' })
  @Delete('project/:project_id/task/:task_id')
  remove(
    @Param('project_id') project_id: number,
    @Param('task_id') task_id: string,
  ) {
    return this.taskService.remove(+project_id, +task_id);
  }
}
