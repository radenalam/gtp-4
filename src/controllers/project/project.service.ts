import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { Project } from 'src/common/models/project.model';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectMembersService } from './project-members.service';

@Injectable()
export class ProjectService {
  constructor(
    @Inject('PROJECT_REPOSITORY') private readonly projectModel: typeof Project,
    private readonly projectMembersService: ProjectMembersService,
  ) {}

  async getAll(
    page: number = 1,
    size: number = 10,
    user_id: number,
  ): Promise<ResponseDto<Project[]>> {
    const offset = (page - 1) * size;

    const projectIds =
      await this.projectMembersService.getUserProjectIds(user_id);

    const { rows: projects, count } = await this.projectModel.findAndCountAll({
      where: { id: projectIds },
      limit: size,
      offset: offset,
    });
    const meta = new PaginationDto({
      page,
      size,
      totalItems: count,
    });
    return new ResponseDto<Project[]>({ data: projects, pagination: meta });
  }

  async findOne(id: number): Promise<ResponseDto<Project>> {
    const project = await this.projectModel.findByPk(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return new ResponseDto<Project>({ data: project });
  }

  async create(
    owner_id: number,
    createProjectDto: CreateProjectDto,
  ): Promise<ResponseDto<Project>> {
    const project = await this.projectModel.create({ ...createProjectDto });
    await this.projectMembersService.createProjectOwner(owner_id, project.id);
    return new ResponseDto<Project>({ data: project });
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ResponseDto<Project>> {
    const project = await this.projectModel.findByPk(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    await this.projectModel.update(updateProjectDto, { where: { id } });

    const updatedProject = await this.projectModel.findByPk(id);
    if (!updatedProject) {
      throw new NotFoundException('Project not found');
    }
    return new ResponseDto<Project>({ data: updatedProject });
  }

  async delete(id: number) {
    const project = await this.projectModel.findByPk(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    await this.projectModel.destroy({ where: { id } });
  }
}
