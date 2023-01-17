import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { JobStatusType } from 'src/enums/job.status.type';

export class JobDto {
  @ApiProperty({required: true})
  @IsString()
  readonly id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: JobStatusType;
}
