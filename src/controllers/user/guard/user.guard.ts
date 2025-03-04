import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class UserGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const user_id = request.params.user_id;

    if (!user) {
      throw new ForbiddenException('Invalid request: missing user ');
    }

    if (!user_id) {
      throw new ForbiddenException('Invalid request: missing user ID');
    }

    if (user.id !== +user_id) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
