import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { ProjectMembers } from './project-members.model';
import { Event } from './event.model';
import { User } from './users.model';

@Table({
  tableName: 'projects',
})
export class Project extends Model {
  @Column
  name: string;

  @Column
  description: string;

  @Column
  status: string;

  @HasMany(() => ProjectMembers, { onDelete: 'CASCADE' })
  projectMembers: ProjectMembers[];

  @HasMany(() => Event, { onDelete: 'CASCADE' })
  events: Event[];

  // @HasMany(() => Task, { onDelete: 'CASCADE' })
  // tasks: Task[];
}
