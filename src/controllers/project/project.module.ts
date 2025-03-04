import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import {
  projectMembersProvider,
  projectProvider,
  userProvider,
} from 'src/common/providers/model.provider';
import { ProjectMembersService } from './project-members.service';

@Module({
  controllers: [ProjectController],
  providers: [
    ProjectService,
    ProjectMembersService,
    projectProvider,
    projectMembersProvider,
    userProvider,
  ],
  exports: [ProjectService, projectProvider, ProjectMembersService],
})
export class ProjectModule {}
