import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IntegrationType } from 'src/enums/integration.type';
import { JobType } from 'src/enums/job.type';
import { DirectionType } from 'src/enums/direction.type';

export class SubworkflowDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly id: string;

  @ApiProperty()
  @IsString()
  workflowId: string;

  @ApiProperty()
  @IsString()
  jobType: JobType;

  @ApiProperty()
  @IsString()
  directionType: DirectionType;

  @ApiProperty()
  @IsString()
  integrationType: IntegrationType;

  @ApiProperty()
  @IsString()
  integrationId: string;

  @ApiProperty()
  @IsString()
  tableName: string;
}
