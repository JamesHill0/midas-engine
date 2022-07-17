import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';

import { Collection } from 'fireorm';

export class GameScorecard {
    id: string;
    gameId: string;
    userId: string;
    name: string;
    hole: number;
    par: number;
    score: number;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('game_scorecard')
export class GameScorecardCollection {
    id: string;
    gameId: string;
    userId: string;
    name: string;
    hole: number;
    par: number;
    score: number;
}

@Entity('game_scorecard')
export class GameScorecardEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    gameId: string;

    @Column()
    userId: string;

    @Column()
    name: string;

    @Column()
    hole: number;

    @Column()
    par: number;

    @Column()
    score: number;
}
