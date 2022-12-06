import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { StatusType } from 'src/enums/status.type';

export class WebhookDto {
  @ApiProperty({required: true})
  @IsString()
  readonly id: string;

  status: StatusType;
}
