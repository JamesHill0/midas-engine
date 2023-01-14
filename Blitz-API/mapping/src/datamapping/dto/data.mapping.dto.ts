import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { DataFormatType } from 'src/enums/data.format.type';

export class DataMappingDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly id: string;

  @ApiProperty()
  @IsString()
  externalId: string;

  @ApiProperty()
  toField: string;

  @ApiProperty()
  @IsString()
  formatType: DataFormatType;

  @ApiProperty()
  @IsString()
  formatting: string;
}
