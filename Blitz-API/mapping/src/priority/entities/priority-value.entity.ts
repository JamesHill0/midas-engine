import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import { Collection } from 'fireorm';
import { PriorityEntity } from './priority.entity';

export class PriorityValue {
    id: string;
    priorityId: string;
    key: string;
    value: string;
    level: number;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('priority-value')
export class PriorityValueCollection {
    id: string;
    priorityId: string;
    key: string;
    value: string;
    level: number;
}

@Entity('priority-value')
export class PriorityValueEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    priorityId: string;

    @Column()
    key: string;

    @Column()
    value: string;

    @Column()
    level: number;  

    @ManyToOne(() => PriorityEntity, priority => priority.values)
    @JoinColumn()
    priority: PriorityEntity;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}