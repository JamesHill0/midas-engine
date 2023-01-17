import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DirectFieldMappingDto {
  @ApiProperty({required: true})
  @IsString()
  readonly id: string;

  @ApiProperty()
  @IsString()
  workflowId: string;

  @ApiProperty()
  @IsString()
  externalId: string;

  @ApiProperty()
  fromField: string;

  @ApiProperty()
  toField: string;
}
