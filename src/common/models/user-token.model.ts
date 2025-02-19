import { Table, Column, Model } from 'sequelize-typescript';

@Table({
  tableName: 'user_token',
})
export class UserToken extends Model {
  @Column
  userId: string;

  @Column
  token: string;
}
