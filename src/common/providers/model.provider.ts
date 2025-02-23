import { Project } from '../models/project.model';
import { UserToken } from '../models/user-token.model';
import { User } from '../models/users.model';
import { Event } from '../models/event.model';

export const userProvider = {
  provide: 'USER_REPOSITORY',
  useValue: User,
};

export const userTokenProvider = {
  provide: 'USER_TOKEN_REPOSITORY',
  useValue: UserToken,
};

export const projectProvider = {
  provide: 'PROJECT_REPOSITORY',
  useValue: Project,
};

export const eventProvider = {
  provide: 'EVENT_REPOSITORY',
  useValue: Event,
};
