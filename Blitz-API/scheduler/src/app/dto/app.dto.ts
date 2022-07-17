import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { StatusType } from 'src/enums/status.type';

export class AppDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    status: StatusType;
}