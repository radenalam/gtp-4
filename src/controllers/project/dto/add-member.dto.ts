import { ApiProperty } from '@nestjs/swagger';

export class addMemberToProjectDto {
  @ApiProperty({ example: 1 })
  user_id: number;

  @ApiProperty({ enum: ['owner', 'member'] })
  role: string;
}
