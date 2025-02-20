import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { projectProvider } from 'src/common/providers/model.provider';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, projectProvider],
})
export class ProjectModule {}
