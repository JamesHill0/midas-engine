import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TaskDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    name2: string;

    @ApiProperty()
    @IsString()
    result: string;

    @ApiProperty()
    @IsString()
    status: string;
}