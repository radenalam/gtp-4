import { Sequelize } from 'sequelize-typescript';
import { mysqlConfig } from '../config/mysql.config';

export const mysqlProvider = {
  provide: 'SEQUELIZE',
  useFactory: async () => {
    const sequelize = new Sequelize(mysqlConfig);
    sequelize.addModels([]);
    await sequelize.sync();
    return sequelize;
  },
};
