import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  project_id: number;

  @ApiProperty({ example: 'Create Login' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Web' })
  @IsNotEmpty()
  description: string;
}
