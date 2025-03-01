import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { taskProvider } from 'src/common/providers/model.provider';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [ProjectModule],
  controllers: [TaskController],
  providers: [TaskService, taskProvider],
})
export class TaskModule {}
