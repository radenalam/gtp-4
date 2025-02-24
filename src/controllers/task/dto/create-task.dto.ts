import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  project_id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;
}
