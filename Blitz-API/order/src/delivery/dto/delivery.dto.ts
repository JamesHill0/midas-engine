import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DeliveryStatusType } from 'src/enums/delivery.status.type';

export class DeliveryDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @IsString()
    status: DeliveryStatusType;

    @IsNumber()
    longtitude: number;

    @IsNumber()
    latitude: number;
}