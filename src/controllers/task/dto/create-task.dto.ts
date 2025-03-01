import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Create Login' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Web' })
  @IsNotEmpty()
  description: string;
}
