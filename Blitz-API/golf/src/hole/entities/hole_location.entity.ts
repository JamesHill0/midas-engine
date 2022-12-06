import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';

import { Collection } from 'fireorm';

export class HoleLocation {
    id: string;
    holeId: string;
    name: string;
    latitude: number;
    longitude: number;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('hole_location')
export class HoleLocationCollection {
    id: string;
    holeId: string;
    name: string;
    latitude: number;
    longitude: number;
}

@Entity('hole_location')
export class HoleLocationEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    holeId: string;

    @Column()
    name: string;

    @Column()
    latitude: number;

    @Column()
    longitude: number;
}