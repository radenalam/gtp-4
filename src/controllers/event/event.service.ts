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

@Injectable()
export class EventService {
  constructor(
    @Inject('EVENT_REPOSITORY') private readonly eventModel: typeof Event,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<ResponseDto<Event>> {
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

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
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
