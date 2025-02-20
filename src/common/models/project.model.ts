import { Column, Model, Table } from 'sequelize-typescript';

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
}
