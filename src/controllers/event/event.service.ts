import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Event } from 'src/common/models/event.model';
import { ProjectService } from '../project/project.service';
import { Project } from 'src/common/models/project.model';

@Injectable()
export class EventService {
  constructor(
    private readonly projectService: ProjectService,
    @Inject('EVENT_REPOSITORY') private readonly eventModel: typeof Event,
  ) {}

  async create(
    project_id: number,
    createEventDto: CreateEventDto,
  ): Promise<ResponseDto<Event>> {
    const projectExists = await this.projectService.findOne(project_id);
    if (!projectExists) {
      throw new NotFoundException('Project not found');
    }

    try {
      const event = await this.eventModel.create({
        ...createEventDto,
        project_id,
      });
      return new ResponseDto<Event>({ data: event });
    } catch (error) {
      console.error('Error creating event:', error);

      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException(
          'Event with the same details already exists',
        );
      }
      throw new InternalServerErrorException('Failed to create event');
    }
  }

  async findAll(
    project_id: number,
    page: number = 1,
    size: number = 10,
  ): Promise<ResponseDto<Event[]>> {
    const offset = (page - 1) * size;
    const { rows: events, count } = await this.eventModel.findAndCountAll({
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
    return new ResponseDto<Event[]>({ data: events, pagination: meta });
  }

  async findOne(
    project_id: number,
    event_id: number,
  ): Promise<ResponseDto<Event>> {
    const event = await this.eventModel.findByPk(event_id, {
      include: [
        {
          model: Project,
          attributes: ['name'],
        },
      ],
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    if (event.project_id !== project_id) {
      throw new BadRequestException(
        'Event does not belong to the specified project',
      );
    }
    return new ResponseDto<Event>({ data: event });
  }

  async update(
    project_id: number,
    event_id: number,
    updateEventDto: UpdateEventDto,
  ): Promise<ResponseDto<Event>> {
    const event = await this.eventModel.findByPk(event_id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    if (event.project_id !== project_id) {
      throw new BadRequestException(
        'Event does not belong to the specified project',
      );
    }

    await this.eventModel.update(updateEventDto, { where: { id: event_id } });

    const updatedEvent = await this.eventModel.findByPk(event_id);
    if (!updatedEvent) {
      throw new InternalServerErrorException('Failed to update event');
    }

    return new ResponseDto<Event>({ data: updatedEvent });
  }

  async remove(project_id: number, event_id: number) {
    const event = await this.eventModel.findByPk(event_id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    if (event.project_id !== project_id) {
      throw new BadRequestException(
        'Event does not belong to the specified project',
      );
    }

    await this.eventModel.destroy({ where: { id: event_id } });
    return HttpStatus.NO_CONTENT;
  }
}
