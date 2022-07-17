import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';

import { Collection } from 'fireorm';

export class Mobile {
    id: string;
    userId: string;
    latitude: number;
    longtitude: number;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('mobile')
export class MobileCollection {
    id: string;
    userId: string;
    latitude: number;
    longtitude: number;
}

@Entity('mobile')
export class MobileEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    userId: string;

    @Column()
    latitude: number;

    @Column()
    longtitude: number;
}