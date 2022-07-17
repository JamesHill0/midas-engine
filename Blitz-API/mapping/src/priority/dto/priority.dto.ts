import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { PriorityValueDto } from './priority-value.dto';

export class PriorityDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @ApiProperty()
    @IsString()
    key: string;

    @ApiProperty()
    values: PriorityValueDto[];
}