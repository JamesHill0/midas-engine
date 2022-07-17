import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinColumn
} from 'typeorm';

import { Collection } from 'fireorm';
import { HoleImage, HoleImageCollection, HoleImageEntity } from './hole_image.entity';
import { HoleVideo, HoleVideoCollection, HoleVideoEntity } from './hole_video.entity';
import { HoleLocation, HoleLocationCollection, HoleLocationEntity } from './hole_location.entity';

export class Hole {
    id: string;
    courseId: string;
    number: number;
    par: number;
    locations: HoleLocation[];
    images: HoleImage[];
    videos: HoleVideo[];

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('hole')
export class HoleCollection {
    id: string;
    courseId: string;
    number: number;
    par: number;
    locations: HoleLocationCollection[];
    images: HoleImageCollection[];
    videos: HoleVideoCollection[];
}

@Entity('hole')
export class HoleEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    courseId: string;

    @Column()
    number: number;

    @Column()
    par: number;

    @OneToMany(() => HoleLocationEntity, hole => hole.holeId)
    locations: HoleLocationEntity[];

    @OneToMany(() => HoleImageEntity, hole => hole.holeId)
    @JoinColumn()
    images: HoleImageEntity[];

    @OneToMany(() => HoleVideoEntity, hole => hole.holeId)
    @JoinColumn()
    videos: HoleVideoEntity[];
}