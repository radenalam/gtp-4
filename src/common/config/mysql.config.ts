import { SequelizeOptions } from 'sequelize-typescript';

export const mysqlConfig: SequelizeOptions = {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  database: 'gtp4',
};
