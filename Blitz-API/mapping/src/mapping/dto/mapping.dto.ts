import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsBoolean } from 'class-validator';
import { JobType } from 'src/enums/job.type';

export class MappingDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly id: string;

  @ApiProperty()
  accountId: string;

  @ApiProperty()
  @IsBoolean()
  editable: boolean;

  @ApiProperty()
  @IsString()
  fromFieldName: string;

  @ApiProperty()
  @IsString()
  toFieldName: string;

  @ApiProperty()
  @IsString()
  fromData: string;

  @ApiProperty()
  @IsString()
  toData: string;
}
