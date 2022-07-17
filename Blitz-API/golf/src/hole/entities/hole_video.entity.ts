import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';

import { Collection } from 'fireorm';

export class HoleVideo {
    id: string;
    holeId: string;
    name: string;
    filename: string;
    bucket: string;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('hole_video')
export class HoleVideoCollection {
    id: string;
    holeId: string;
    name: string;
    filename: string;
    bucket: string;
}

@Entity('hole_video')
export class HoleVideoEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    holeId: string;

    @Column()
    name: string;

    @Column()
    filename: string;

    @Column()
    bucket: string;
}