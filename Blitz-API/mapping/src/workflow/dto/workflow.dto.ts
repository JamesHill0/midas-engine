import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
import { MappingType } from 'src/enums/mapping.type';
import { StatusType } from 'src/enums/status.type';

export class WorkflowDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  status: StatusType;

  @ApiProperty()
  @IsString()
  mappingType: MappingType;

  @ApiProperty()
  @IsBoolean()
  needDataMapping: boolean;
}
