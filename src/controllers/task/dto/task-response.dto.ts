import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  project_id: number;

  @ApiProperty({ nullable: true })
  project_name?: string;

  constructor(partial: Partial<TaskResponseDto>) {
    Object.assign(this, partial);
  }
}
