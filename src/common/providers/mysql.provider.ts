import { Sequelize } from 'sequelize-typescript';
import { mysqlConfig } from '../config/mysql.config';
import { User } from '../models/users.model';
import { UserToken } from '../models/user-token.model';
import { Project } from '../models/project.model';
import { Event } from '../models/event.model';

export const mysqlProvider = {
  provide: 'SEQUELIZE',
  useFactory: async () => {
    const sequelize = new Sequelize(mysqlConfig);
    sequelize.addModels([User, UserToken, Project, Event]);
    await sequelize.sync();
    return sequelize;
  },
};
