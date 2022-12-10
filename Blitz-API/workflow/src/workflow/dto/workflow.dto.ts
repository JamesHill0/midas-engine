import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { StatusType } from 'src/enums/status.type';
import { WorkflowType } from 'src/enums/workflow.type';

export class WorkflowDto {
  @ApiProperty({required: true})
  @IsString()
  readonly id: string;

  status: StatusType;

  workflowType: WorkflowType;
}
