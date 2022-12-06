import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';

import { Collection } from 'fireorm';

export class Registered {
    id: string;
    accountId: number;
    name: string;
    type: string;
    latitude: number;
    longtitude: number;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('registered')
export class RegisteredCollection {
    id: string;
    accountId: number;
    name: string;
    type: string;
    latitude: number;
    longtitude: number;
}

@Entity()
export class RegisteredEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    accountId: number;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column()
    latitude: number;

    @Column()
    longtitude: number;
}