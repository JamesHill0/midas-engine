import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
import { StatusType } from 'src/enums/status.type';

export class UserDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @ApiProperty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsString()
    status: StatusType;
}