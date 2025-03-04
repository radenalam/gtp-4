import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { UserToken } from './user-token.model';

@Table({
  tableName: 'users',
})
export class User extends Model {
  @Column
  name: string;

  @Column({ type: DataType.STRING(20), unique: true })
  phone_number: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column
  password: string;

  @HasMany(() => UserToken, { onDelete: 'CASCADE' })
  user_token: UserToken[];

  toJSON() {
    const attributes = { ...this.get() };
    delete attributes.password;
    return attributes;
  }
}
