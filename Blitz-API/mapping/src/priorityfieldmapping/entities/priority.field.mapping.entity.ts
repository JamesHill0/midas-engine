import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinColumn
} from 'typeorm';

import { Collection } from 'fireorm';

import { PriorityFieldMappingValue, PriorityFieldMappingValueCollection, PriorityFieldMappingValueEntity } from './priority.field.mapping.value.entity';

export class PriorityFieldMapping {
    id: string;
    workflowId: string;
    externalId: string;
    fromField: string;
    values: PriorityFieldMappingValue[];

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('priority-field-mappings')
export class PriorityFieldMappingCollection {
    id: string;
    workflowId: string;
    externalId: string;
    fromField: string;
    values: PriorityFieldMappingValueCollection[];
}

@Entity('priority-field-mappings')
export class PriorityFieldMappingEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    workflowId: string;

    @Column()
    externalId: string;

    @Column()
    fromField: string;

    @OneToMany(() => PriorityFieldMappingValueEntity, value => value.priority, { eager: true, cascade: true, onUpdate: 'CASCADE' })
    @JoinColumn()
    values: PriorityFieldMappingValueEntity[];

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}
