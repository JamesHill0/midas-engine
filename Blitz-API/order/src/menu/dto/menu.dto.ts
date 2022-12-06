import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MenuDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @IsString()
    image: string;

    @IsNumber()
    price: number;

    @IsString()
    description: string;
}