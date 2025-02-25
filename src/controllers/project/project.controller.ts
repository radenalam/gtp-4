import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectMembersService } from './project-members.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectMemberGuard } from './guards/project-member.guard';
import { Project } from 'src/common/models/project.model';
import { ProjectOwnerGuard } from './guards/project-owner.guard';

@UseGuards(JwtAuthGuard)
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
    @Request() req,
  ) {
    return this.projectService.getAll(+page, +size, req.user.id);
  }

  @UseGuards(ProjectMemberGuard)
  @ApiOperation({ summary: 'Get project By Id' })
  @Get(':id')
  getProjectById(@Param('id') id: number) {
    return this.projectService.findOne(+id);
  }

  @ApiOperation({ summary: 'Create project' })
  @Post()
  async create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(req.user.id, createProjectDto);
  }

  @UseGuards(ProjectMemberGuard)
  @ApiOperation({ summary: 'Edit project' })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateProjectDto: CreateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @UseGuards(ProjectOwnerGuard)
  @ApiOperation({ summary: 'Delete project' })
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.projectService.delete(+id);
  }

  @UseGuards(ProjectMemberGuard)
  @ApiOperation({ summary: 'Get project members' })
  @Get(':id/members')
  async getMembers(
    @Param('id') project_id: number,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ) {
    return this.projectMembersService.getProjectMembers(project_id, page, size);
  }

  @UseGuards(ProjectOwnerGuard)
  @ApiOperation({ summary: 'Add member to project' })
  @Post(':id/members')
  async addMember(
    @Param('id') project_id: number,
    @Body() body: { user_id: number; role: string },
    @Request() req,
  ) {
    const loggedInUserId = req.user.id;

    return this.projectMembersService.addMemberToProject(
      loggedInUserId,
      body.user_id,
      project_id,
      body.role,
    );
  }

  @UseGuards(ProjectOwnerGuard)
  @ApiOperation({ summary: 'Remove member from project' })
  @Delete(':id/members/:user_id')
  async removeMember(
    @Param('id') project_id: number,
    @Param('user_id') user_id: number,
    @Request() req,
  ) {
    const loggedInUserId = req.user.id;
    return this.projectMembersService.removeMemberFromProject(
      loggedInUserId,
      project_id,
      user_id,
    );
  }
}
