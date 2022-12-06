import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GameTeamDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @IsString()
    gameId: string;

    @IsString()
    userId: string;
    
    @IsString()
    name: string;

    @IsNumber()
    handicap: number;
}