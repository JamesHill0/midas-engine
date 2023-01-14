import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DataMappingOptionDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly id: string;

  @ApiProperty()
  @IsString()
  dataMappingId: string;

  @ApiProperty()
  fromData: string;

  @ApiProperty()
  toData: string;
}
