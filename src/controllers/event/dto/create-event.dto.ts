import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'Sparing Code' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Mobile' })
  @IsNotEmpty()
  description: string;
}
