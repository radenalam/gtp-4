import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './users.model';
import { Project } from './project.model';

@Table({
  tableName: 'project_members',
})
export class ProjectMembers extends Model {
  @ForeignKey(() => Project)
  @Column
  project_id: number;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @Column
  role: string;

  @BelongsTo(() => Project, { onDelete: 'CASCADE' })
  project: Project;

  @BelongsTo(() => User)
  user: User;
}
