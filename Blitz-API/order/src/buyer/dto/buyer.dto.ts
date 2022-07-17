import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class BuyerDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @IsNumber()
    latitude: number;

    @IsNumber()
    longtitude: number;
}