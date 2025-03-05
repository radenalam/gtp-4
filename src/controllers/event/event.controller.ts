import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectMemberGuard } from '../project/guards/project-member.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(ProjectMemberGuard)
  @ApiOperation({ summary: 'Create event' })
  @Post('project/:project_id/event')
  create(
    @Param('project_id') project_id: number,
    @Body() createEventDto: CreateEventDto,
  ) {
    return this.eventService.create(+project_id, createEventDto);
  }

  @UseGuards(ProjectMemberGuard)
  @ApiOperation({ summary: 'Get All event' })
  @ApiQuery({ name: 'page', example: 1 })
  @ApiQuery({ name: 'size', example: 10 })
  @Get('project/:project_id/event')
  findAll(
    @Param('project_id') project_id: number,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ) {
    return this.eventService.findAll(project_id, +page, +size);
  }

  @UseGuards(ProjectMemberGuard)
  @ApiOperation({ summary: 'Get event by id' })
  @Get('project/:project_id/event/:event_id')
  findOne(
    @Param('project_id') project_id: number,
    @Param('event_id') event_id: string,
  ) {
    return this.eventService.findOne(+project_id, +event_id);
  }

  @UseGuards(ProjectMemberGuard)
  @ApiOperation({ summary: 'Edit event' })
  @Patch('project/:project_id/event/:event_id')
  update(
    @Param('project_id') project_id: string,
    @Param('event_id') event_id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.update(+project_id, +event_id, updateEventDto);
  }

  @UseGuards(ProjectMemberGuard)
  @ApiOperation({ summary: 'Delete event' })
  @Delete('project/:project_id/event/:event_id')
  remove(
    @Param('project_id') project_id: string,
    @Param('event_id') event_id: number,
  ) {
    return this.eventService.remove(+project_id, +event_id);
  }
}
