import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from 'typeorm';

import { Collection } from 'fireorm';

export class Task {
    id: string;
    name: string;
    name2: string;
    result: string;
    status: string;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('task')
export class TaskCollection {
    id: string;
    name: string;
    name2: string;
    result: string;
    status: string;
}

@Entity('task')
export class TaskEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    name2: string;

    @Column()
    result: string;

    @Column()
    status: string;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
