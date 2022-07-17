import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PriorityValueDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @ApiProperty()
    @IsString()
    priorityId: string;

    @ApiProperty()
    @IsString()
    key: string;

    @ApiProperty()
    @IsString()
    value: string;

    @ApiProperty()
    @IsNumber()
    level: number;
}