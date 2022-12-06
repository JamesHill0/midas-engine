import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    ManyToMany,
    OneToMany
} from 'typeorm';
import { GameStatus } from '../../enums/game.status';

import { Collection } from 'fireorm';

import { GameTeam, GameTeamCollection, GameTeamEntity } from './game_team.entity';
import { GameScorecard, GameScorecardCollection, GameScorecardEntity } from './game_scorecard.entity';
import { Course, CourseCollection, CourseEntity } from 'src/course/entities/course.entity';

export class Game {
    id: string;
    userId: string;
    courseId: string;
    currentHole: number;
    status: string;
    course: Course;
    scorecards: GameScorecard[];
    teams: GameTeam[];

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('game')
export class GameCollection {
    id: string;
    userId: string;
    courseId: string;
    currentHole: number;
    status: string;
    course: CourseCollection;
    scorecards: GameScorecardCollection[];
    teams: GameTeamCollection[];
}

@Entity()
export class GameEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    userId: string;

    @Column()
    courseId: string;

    @Column()
    currentHole: number;

    @Column()
    status: GameStatus;

    @ManyToMany(() => CourseEntity, { eager: true })
    course: CourseEntity;

    @OneToMany(() => GameScorecardEntity, scorecard => scorecard.gameId)
    @JoinColumn()
    scorecards: GameScorecardEntity[];

    @OneToMany(() => GameTeamEntity, game => game.gameId)
    @JoinColumn()
    teams: GameTeamEntity[];
}