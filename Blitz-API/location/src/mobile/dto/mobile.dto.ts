import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MobileDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @IsString()
    userId: string;

    @IsNumber()
    latitude: number;

    @IsNumber()
    longtitude: number;
}