import {
  ForbiddenException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { addMemberToProjectDto } from './dto/add-member.dto';
import { ProjectMembers } from 'src/common/models/project-members.model';
import { ResponseDto } from 'src/common/dto/response.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProjectMembersService {
  constructor(
    @Inject('PROJECT_MEMBERS_REPOSITORY')
    private readonly projectMembersModel: typeof ProjectMembers,
  ) {}

  async getProjectMembers(
    project_id: number,
    page: number = 1,
    size: number = 10,
  ): Promise<ResponseDto<ProjectMembers[]>> {
    const offset = (page - 1) * size;
    const { rows: projects, count } =
      await this.projectMembersModel.findAndCountAll({
        where: { project_id },
        limit: size,
        offset: offset,
      });
    const meta = new PaginationDto({
      page,
      size,
      totalItems: count,
    });
    return new ResponseDto<ProjectMembers[]>({
      data: projects,
      pagination: meta,
    });
  }

  async checkUserAccess(user_id: number, project_id: number): Promise<boolean> {
    const projectMember = await this.projectMembersModel.findOne({
      where: { user_id: user_id, project_id: project_id },
    });

    if (!projectMember) {
      throw new ForbiddenException(
        'Access denied: You are not a member of this project',
      );
    }
    return true;
  }

  async addMemberToProject(
    user_id: number,
    project_id: number,
    role: string,
  ): Promise<ProjectMembers> {
    const existingMember = await this.projectMembersModel.findOne({
      where: { user_id, project_id },
    });

    if (existingMember) {
      throw new ForbiddenException('User is already a member of this project');
    }
    return this.projectMembersModel.create({
      user_id,
      project_id,
      role,
    });
  }

  async removeMemberFromProject(
    loggedInUserId: number,
    project_id: number,
    user_id: number,
  ): Promise<void> {
    const owner = await this.projectMembersModel.findOne({
      where: { user_id: loggedInUserId, project_id, role: 'owner' },
    });

    if (!owner) {
      throw new ForbiddenException('Only the project owner can remove members');
    }

    const member = await this.projectMembersModel.findOne({
      where: { user_id, project_id },
    });

    if (!member) {
      throw new NotFoundException('Project member not found');
    }

    await this.projectMembersModel.destroy({ where: { user_id, project_id } });
  }
}
