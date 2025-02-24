import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { Task } from 'src/common/models/task.model';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Project } from 'src/common/models/project.model';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TASK_REPOSITORY') private readonly taskModel: typeof Task,
  ) {}
  async create(createTaskDto: CreateTaskDto): Promise<ResponseDto<Task>> {
    const task = await this.taskModel.create({ ...createTaskDto });
    return new ResponseDto<Task>({ data: task });
  }

  async findAll(
    page: number = 1,
    size: number = 10,
  ): Promise<ResponseDto<Task[]>> {
    const offset = (page - 1) * size;
    const { rows: tasks, count } = await this.taskModel.findAndCountAll({
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

  async findOne(id: number): Promise<ResponseDto<Task>> {
    const task = await this.taskModel.findByPk(id, {
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
    return new ResponseDto<Task>({ data: task });
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<ResponseDto<Task>> {
    const task = await this.taskModel.findByPk(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    await this.taskModel.update(updateTaskDto, { where: { id } });

    const updatedTask = await this.taskModel.findByPk(id);
    if (!updatedTask) {
      throw new NotFoundException('Task not found');
    }
    return new ResponseDto<Task>({ data: updatedTask });
  }

  async remove(id: number) {
    const task = await this.taskModel.findByPk(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.taskModel.destroy({ where: { id } });
    return HttpStatus.NO_CONTENT;
  }
}
