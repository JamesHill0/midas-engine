import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { StatusType } from 'src/enums/status.type';

export class WbEtlDto {
  @ApiProperty({required: true})
  @IsString()
  readonly id: string;

  status: StatusType;

  data: any;
}
