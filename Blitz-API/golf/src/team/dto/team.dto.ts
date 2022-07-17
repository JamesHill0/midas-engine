import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class TeamDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string

    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNumber()
    handicap: number;
}