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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectMembersService } from './project-members.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectMemberGuard } from './guards/project-member.guard';
import { Project } from 'src/common/models/project.model';
import { ProjectOwnerGuard } from './guards/project-owner.guard';
import { addMemberToProjectDto } from './dto/add-member.dto';

@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly projectMembersService: ProjectMembersService,
  ) {}

  @ApiOperation({ summary: 'Get all projects' })
  @ApiQuery({ name: 'page', example: 1 })
  @ApiQuery({ name: 'size', example: 10 })
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
  @Get(':project_id')
  getProjectById(@Param('project_id') project_id: number) {
    return this.projectService.findOne(+project_id);
  }

  @ApiOperation({ summary: 'Create project' })
  @Post()
  async create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(req.user.id, createProjectDto);
  }

  @UseGuards(ProjectMemberGuard)
  @ApiOperation({ summary: 'Edit project' })
  @Patch(':project_id')
  update(
    @Param('project_id') project_id: number,
    @Body() updateProjectDto: CreateProjectDto,
  ) {
    return this.projectService.update(+project_id, updateProjectDto);
  }

  @UseGuards(ProjectOwnerGuard)
  @ApiOperation({ summary: 'Delete project' })
  @Delete(':project_id')
  delete(@Param('project_id') project_id: number) {
    return this.projectService.delete(+project_id);
  }

  @UseGuards(ProjectMemberGuard)
  @ApiOperation({ summary: 'Get project members' })
  @ApiQuery({ name: 'page', example: 1 })
  @ApiQuery({ name: 'size', example: 10 })
  @Get(':project_id/members')
  async getMembers(
    @Param('project_id') project_id: number,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ) {
    return this.projectMembersService.getProjectMembers(
      project_id,
      +page,
      +size,
    );
  }

  @UseGuards(ProjectOwnerGuard)
  @ApiOperation({ summary: 'Add member to project' })
  @Post(':project_id/members')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', example: 1 },
        role: { type: 'string', example: 'member' },
      },
    },
  })
  async addMember(
    @Param('project_id') project_id: number,
    @Body() body: { user_id: number; role: string },
  ) {
    return this.projectMembersService.addMemberToProject(
      body.user_id,
      project_id,
      body.role,
    );
  }

  @UseGuards(ProjectOwnerGuard)
  @ApiOperation({ summary: 'Remove member from project' })
  @Delete(':project_id/members/:user_id')
  async removeMember(
    @Param('project_id') project_id: number,
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
