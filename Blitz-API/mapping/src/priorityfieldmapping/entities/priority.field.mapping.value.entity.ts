import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import { Collection } from 'fireorm';
import { PriorityFieldMappingEntity } from './priority.field.mapping.entity';

export class PriorityFieldMappingValue {
    id: string;
    priorityId: string;
    toField: string;
    level: number;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('priority-field-mapping-values')
export class PriorityFieldMappingValueCollection {
    id: string;
    priorityId: string;
    toField: string;
    level: number;
}

@Entity('priority-field-mapping-values')
export class PriorityFieldMappingValueEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    priorityId: string;

    @Column()
    toField: string;

    @Column()
    level: number;

    @ManyToOne(() => PriorityFieldMappingEntity, priority => priority.values)
    @JoinColumn()
    priority: PriorityFieldMappingEntity;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}
