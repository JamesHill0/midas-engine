import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinColumn
} from 'typeorm';

import { Collection } from 'fireorm';

import { PriorityValue, PriorityValueCollection, PriorityValueEntity } from './priority-value.entity';

export class Priority {
    id: string;
    key: string;
    values: PriorityValue[];

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('priorities')
export class PriorityCollection {
    id: string;
    key: string;
    values: PriorityValueCollection[];
}

@Entity('priorities')
export class PriorityEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ unique: true })
    key: string;

    @OneToMany(() => PriorityValueEntity, value => value.priority, { eager: true, cascade: true, onUpdate: 'CASCADE' })
    @JoinColumn()
    values: PriorityValueEntity[];

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}