import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  project_id: number;

  @ApiProperty({ example: 'Sparing Code' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Mobile' })
  @IsNotEmpty()
  description: string;
}
