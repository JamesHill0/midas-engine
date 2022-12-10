import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class WorkflowDto {
  @ApiProperty({required: true})
  @IsString()
  readonly id: string;
}
