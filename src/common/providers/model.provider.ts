import { Project } from '../models/project.model';
import { UserToken } from '../models/user-token.model';
import { User } from '../models/users.model';
import { Event } from '../models/event.model';
import { ProjectMembers } from '../models/project-members.model';
import { Task } from '../models/task.model';

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

export const projectMembersProvider = {
  provide: 'PROJECT_MEMBERS_REPOSITORY',
  useValue: ProjectMembers,
};

export const eventProvider = {
  provide: 'EVENT_REPOSITORY',
  useValue: Event,
};

export const taskProvider = {
  provide: 'TASK_REPOSITORY',
  useValue: Task,
};
