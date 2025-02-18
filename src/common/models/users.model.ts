import { Table, Column, Model } from 'sequelize-typescript';

@Table({
  tableName: 'users',
})
export class User extends Model {
  @Column
  name: string;

  @Column
  username: string;

  @Column
  email: string;

  @Column
  password: string;
}
