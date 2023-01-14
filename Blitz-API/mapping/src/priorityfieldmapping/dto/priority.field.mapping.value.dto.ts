import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PriorityFieldMappingValueDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @ApiProperty()
    @IsString()
    priorityId: string;

    @ApiProperty()
    @IsString()
    toField: string;

    @ApiProperty()
    @IsNumber()
    level: number;
}
