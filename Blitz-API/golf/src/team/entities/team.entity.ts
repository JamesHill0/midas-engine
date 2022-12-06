import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';

import { Collection } from 'fireorm';

export class Team {
    id: string;
    userId: string;
    name: string;
    handicap: number;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('team')
export class TeamCollection {
    id: string;
    userId: string;
    name: string;
    handicap: number;
}

@Entity('team')
export class TeamEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    userId: string;

    @Column()
    name: string;

    @Column()
    handicap: number;
}