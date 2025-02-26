import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ProjectMembersService } from '../project-members.service';

@Injectable()
export class ProjectOwnerGuard implements CanActivate {
  constructor(private readonly projectMembersService: ProjectMembersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const project_id = request.params.project_id;

    if (!user || !project_id) {
      throw new ForbiddenException(
        'Invalid request: missing user or project ID',
      );
    }

    const isOwner = await this.projectMembersService.checkUserIsOwner(
      user.id,
      +project_id,
    );
    if (!isOwner) {
      throw new ForbiddenException(
        'Access denied: You are not a owner of this project',
      );
    }

    return true;
  }
}
