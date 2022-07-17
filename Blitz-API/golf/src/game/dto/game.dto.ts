import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CourseDto } from 'src/course/dto/course.dto';
import { GameTeamDto } from './game_team.dto';
import { GameScorecardDto } from './game_scorecard.dto';
import { GameStatus } from '../../enums/game.status';

export class GameDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @IsString()
    userId: string;

    @IsString()
    courseId: string;

    @IsNumber()
    currentHole: number;

    @IsString()
    status: GameStatus;

    @ApiProperty()
    course: CourseDto;

    @ApiProperty()
    scorecards: GameScorecardDto[];

    @ApiProperty()
    teams: GameTeamDto[];
}