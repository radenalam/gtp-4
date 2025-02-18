import { User } from '../models/users.model';

export const userProvider = {
  provide: 'USER_REPOSITORY',
  useValue: User,
};
