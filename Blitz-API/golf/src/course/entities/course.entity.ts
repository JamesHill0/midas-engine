import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinColumn
} from 'typeorm';

import { Collection } from 'fireorm';

import {Hole, HoleCollection, HoleEntity} from 'src/hole/entities/hole.entity';

export class Course {
    id: string;
    name: string;
    slopeRating: number;
    courseRating: number;
    yard: number;
    price: number;
    address: string;
    latitude: number;
    longtitude: number;
    hasVideo: boolean;
    description: string;
    holes: Hole[];

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('course')
export class CourseCollection {
    id: string;
    name: string;
    slopeRating: number;
    courseRating: number;
    yard: number;
    price: number;
    address: string;
    latitude: number;
    longtitude: number;
    hasVideo: boolean;
    description: string;
    holes: HoleCollection[];
}

@Entity('course')
export class CourseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    slopeRating: number;

    @Column()
    courseRating: number;

    @Column()
    yard: number;

    @Column()
    price: number;

    @Column()
    address: string;

    @Column()
    latitude: number;

    @Column()
    longtitude: number;

    @Column()
    hasVideo: boolean;

    @Column()
    description: string;

    @OneToMany(() => HoleEntity, hole => hole.courseId)
    @JoinColumn()
    holes: HoleEntity[];
}