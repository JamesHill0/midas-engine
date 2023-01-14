import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { DirectionType } from '../../enums/direction.type';
import { StatusType } from '../../enums/status.type';

export class IntegrationDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    name: string;

    status: StatusType;

    direction: DirectionType;

    externalId: string;
}
