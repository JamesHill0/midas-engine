import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class HoleVideoDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @IsString()
    holeId: string;

    @IsString()
    name: string;

    @IsString()
    filename: string;

    @IsString()
    bucket: string;
}