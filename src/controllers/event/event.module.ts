import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { eventProvider } from 'src/common/providers/model.provider';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [ProjectModule],
  controllers: [EventController],
  providers: [EventService, eventProvider],
})
export class EventModule {}
