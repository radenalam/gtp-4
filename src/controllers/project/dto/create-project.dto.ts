import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Project Name' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Project pertama' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'On Progress' })
  @IsNotEmpty()
  status: string;
}
