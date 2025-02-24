import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import {
  projectProvider,
  taskProvider,
} from 'src/common/providers/model.provider';
import { ProjectService } from '../project/project.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, taskProvider],
})
export class TaskModule {}
