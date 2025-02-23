import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { eventProvider } from 'src/common/providers/model.provider';

@Module({
  controllers: [EventController],
  providers: [EventService, eventProvider],
})
export class EventModule {}
