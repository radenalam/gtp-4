import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Project } from './project.model';

@Table({ tableName: 'tasks' })
export class Task extends Model {
  @ForeignKey(() => Project)
  @Column({
    allowNull: false,
  })
  project_id: number;

  @Column
  name: string;

  @Column
  description: string;

  @BelongsTo(() => Project)
  project: Project;
}
