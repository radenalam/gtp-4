import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import {
  projectMembersProvider,
  projectProvider,
} from 'src/common/providers/model.provider';
import { ProjectMembersService } from './project-members.service';

@Module({
  controllers: [ProjectController],
  providers: [
    ProjectService,
    ProjectMembersService,
    projectProvider,
    projectMembersProvider,
  ],
  exports: [ProjectService, projectProvider],
})
export class ProjectModule {}
