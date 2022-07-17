import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';

import { Collection } from 'fireorm';

export class GameTeam {
    id: string;
    gameId: string;
    userId: string;
    name: string;
    handicap: number;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('game_team')
export class GameTeamCollection {
    id: string;
    gameId: string;
    userId: string;
    name: string;
    handicap: number;
}

@Entity('game_team')
export class GameTeamEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    gameId: string;

    @Column()
    userId: string;

    @Column()
    name: string;

    @Column()
    handicap: number;
}