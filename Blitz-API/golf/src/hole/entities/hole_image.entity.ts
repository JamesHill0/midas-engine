import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';

import { Collection } from 'fireorm';

export class HoleImage {
    id: string;
    holeId: string;
    name: string;
    filename: string;
    bucket: string;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('hole_image')
export class HoleImageCollection {
    id: string;
    holeId: string;
    name: string;
    filename: string;
    bucket: string;
}

@Entity('hole_image')
export class HoleImageEntity {
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