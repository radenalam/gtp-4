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

@Injectable()
export class EventService {
  constructor(
    private readonly projectService: ProjectService,
    @Inject('EVENT_REPOSITORY') private readonly eventModel: typeof Event,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<ResponseDto<Event>> {
    const projectExists = await this.projectService.findOne(
      createEventDto.project_id,
    );
    if (!projectExists) {
      throw new NotFoundException('Project not found');
    }

    try {
      const event = await this.eventModel.create({ ...createEventDto });
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
    page: number = 1,
    size: number = 10,
  ): Promise<ResponseDto<Event[]>> {
    const offset = (page - 1) * size;
    const { rows: events, count } = await this.eventModel.findAndCountAll({
      limit: size,
      offset: offset,
    });
    const meta = new PaginationDto({
      page,
      size,
      totalItems: count,
    });
    return new ResponseDto<Event[]>({ data: events, pagination: meta });
  }

  async findOne(id: number): Promise<ResponseDto<Event>> {
    const event = await this.eventModel.findByPk(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return new ResponseDto<Event>({ data: event });
  }

  async update(
    id: number,
    updateEventDto: UpdateEventDto,
  ): Promise<ResponseDto<Event>> {
    const event = await this.eventModel.findByPk(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await this.eventModel.update(updateEventDto, { where: { id } });

    const updatedEvent = await this.eventModel.findByPk(id);
    if (!updatedEvent) {
      throw new InternalServerErrorException('Failed to update event');
    }

    return new ResponseDto<Event>({ data: updatedEvent });
  }

  async remove(id: number) {
    const event = await this.eventModel.findByPk(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await this.eventModel.destroy({ where: { id } });
    return HttpStatus.NO_CONTENT;
  }
}
