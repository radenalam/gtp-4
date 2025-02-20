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

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

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
}
