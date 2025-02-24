import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiOperation({ summary: 'Create event' })
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @ApiOperation({ summary: 'Get All event' })
  @Get()
  findAll(@Query('page') page: number = 1, @Query('size') size: number = 10) {
    return this.eventService.findAll(+page, +size);
  }

  @ApiOperation({ summary: 'Get event by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @ApiOperation({ summary: 'Edit event' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }

  @ApiOperation({ summary: 'Delete event' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
