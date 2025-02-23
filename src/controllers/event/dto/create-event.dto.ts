import { IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  project_id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;
}
