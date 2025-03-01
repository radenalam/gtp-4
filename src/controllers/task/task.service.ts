import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { Task } from 'src/common/models/task.model';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Project } from 'src/common/models/project.model';
import { ProjectService } from '../project/project.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly projectService: ProjectService,
    @Inject('TASK_REPOSITORY') private readonly taskModel: typeof Task,
  ) {}
  async create(
    project_id: number,
    createTaskDto: CreateTaskDto,
  ): Promise<ResponseDto<Task>> {
    const projectExists = await this.projectService.findOne(project_id);
    if (!projectExists) {
      throw new NotFoundException('Project not found');
    }

    try {
      const task = await this.taskModel.create({
        ...createTaskDto,
        project_id,
      });
      return new ResponseDto<Task>({ data: task });
    } catch (error) {
      console.error('Error creating task:', error);

      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException(
          'Task with the same details already exists',
        );
      }
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  async findAll(
    project_id: number,
    page: number = 1,
    size: number = 10,
  ): Promise<ResponseDto<Task[]>> {
    const offset = (page - 1) * size;
    const { rows: tasks, count } = await this.taskModel.findAndCountAll({
      where: { project_id },
      limit: size,
      offset: offset,
      include: [
        {
          model: Project,
          attributes: ['name'],
        },
      ],
    });
    const meta = new PaginationDto({
      page,
      size,
      totalItems: count,
    });
    return new ResponseDto<Task[]>({ data: tasks, pagination: meta });
  }

  async findOne(
    project_id: number,
    task_id: number,
  ): Promise<ResponseDto<Task>> {
    const task = await this.taskModel.findByPk(task_id, {
      include: [
        {
          model: Project,
          attributes: ['name'],
        },
      ],
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.project_id !== project_id) {
      throw new NotFoundException('Task does not belong to project');
    }
    return new ResponseDto<Task>({ data: task });
  }

  async update(
    project_id: number,
    task_id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<ResponseDto<Task>> {
    const task = await this.taskModel.findByPk(task_id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task.project_id !== project_id) {
      throw new NotFoundException('Task does not belong to project');
    }

    await this.taskModel.update(updateTaskDto, { where: { id: task_id } });

    const updatedTask = await this.taskModel.findByPk(task_id);
    if (!updatedTask) {
      throw new NotFoundException('Task not found');
    }
    return new ResponseDto<Task>({ data: updatedTask });
  }

  async remove(project_id: number, task_id: number) {
    const task = await this.taskModel.findByPk(task_id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.project_id !== project_id) {
      throw new NotFoundException('Task does not belong to project');
    }

    await this.taskModel.destroy({ where: { id: task_id } });
    return HttpStatus.NO_CONTENT;
  }
}
