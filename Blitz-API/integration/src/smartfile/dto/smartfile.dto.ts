import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { StatusType } from 'src/enums/status.type';
import { SecretDto } from './secret.dto';

export class SmartFileDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    status: StatusType;

    @ApiProperty()
    secret: SecretDto;
}
