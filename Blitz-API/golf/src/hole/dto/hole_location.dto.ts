import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class HoleLocationDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @IsString()
    holeId: string;

    @IsString()
    name: string;

    @IsNumber()
    longitude: number;

    @IsNumber()
    latitude: number;
}