import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class RegisteredDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @IsNumber()
    accountId: number;

    @IsString()
    name: string;

    @IsString()
    type: string;

    @IsNumber()
    latitude: number;

    @IsNumber()
    longtitude: number;
}