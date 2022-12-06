import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { GameDto } from 'src/game/dto/game.dto';
import { TeamDto } from 'src/team/dto/team.dto';

export class UserInfoDto {
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

    @ApiProperty()
    @IsNumber()
    longtitude: number;

    @ApiProperty()
    @IsNumber()
    latitude: number;

    @ApiProperty()
    teams: TeamDto[];

    @ApiProperty()
    games: GameDto[];
}