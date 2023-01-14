import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { PriorityFieldMappingValueDto } from './priority.field.mapping.value.dto';

export class PriorityFieldMappingDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @ApiProperty()
    @IsString()
    externalId: string;

    @ApiProperty()
    @IsString()
    fromField: string;

    @ApiProperty()
    values: PriorityFieldMappingValueDto[];
}
