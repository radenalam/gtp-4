import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ProjectMembersService } from '../project-members.service';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(private readonly projectMembersService: ProjectMembersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const project_id = request.params.id;

    if (!user || !project_id) {
      throw new ForbiddenException(
        'Invalid request: missing user or project ID',
      );
    }

    const hasAccess = await this.projectMembersService.checkUserAccess(
      user.id,
      +project_id,
    );

    if (!hasAccess) {
      throw new ForbiddenException(
        'Access denied: You are not a member of this project',
      );
    }

    return true;
  }
}
