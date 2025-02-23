import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectMembersService } from './project-members.service';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly projectMembersService: ProjectMembersService,
  ) {}

  @ApiOperation({ summary: 'Get all projects' })
  @Get()
  async getProjects(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ) {
    return this.projectService.getAll(+page, +size);
  }

  @ApiOperation({ summary: 'Get project By Id' })
  @Get(':id')
  getProjectById(@Param('id') id: number) {
    return this.projectService.findOne(+id);
  }

  @ApiOperation({ summary: 'Create project' })
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @ApiOperation({ summary: 'Edit project' })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateProjectDto: CreateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @ApiOperation({ summary: 'Delete project' })
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.projectService.delete(+id);
  }

  @Get(':id/members')
  async getMembers(
    @Param('id') project_id: number,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ) {
    return this.projectMembersService.getProjectMembers(project_id, page, size);
  }

  @Post(':id/members')
  async addMember(
    @Param('id') project_id: number,
    @Body() body: { user_id: number; role: string },
  ) {
    return this.projectMembersService.addMemberToProject(
      body.user_id,
      project_id,
      body.role,
    );
  }

  @Delete(':id/members/:user_id')
  async removeMember(
    @Param('id') project_id: number,
    @Param('user_id') user_id: number,
    // @Request() req
  ) {
    // const loggedInUserId = req.user.id;
    const loggedInUserId = project_id;
    return this.projectMembersService.removeMemberFromProject(
      loggedInUserId,
      project_id,
      user_id,
    );
  }
}
