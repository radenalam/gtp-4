import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './users.model';

@Table({
  tableName: 'user_token',
})
export class UserToken extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  token: string;

  @BelongsTo(() => User)
  user: User;
}
