import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinColumn
} from 'typeorm';

import { Collection } from 'fireorm';

import { Mapping, MappingCollection, MappingEntity } from 'src/mapping/entities/mapping.entity';
import { JobType } from 'src/enums/job.type';

export class AccountMapping {
    id: string;
    name: string;
    currentJob: JobType;
    protected: boolean;
    workflowId: string;
    externalId: string;
    mappings: Mapping[];
    result: string;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('account')
export class AccountMappingCollection {
    id: string;
    name: string;
    currentJob: JobType;
    protected: boolean;
    workflowId: string;
    externalId: string;
    mappings: MappingCollection[];
    result: string;
}

@Entity('account')
export class AccountMappingEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ unique: true })
    name: string;

    @Column()
    currentJob: JobType;

    @Column()
    protected: boolean;

    @Column()
    workflowId: string;

    @Column()
    externalId: string;

    @OneToMany(() => MappingEntity, mapping => mapping.account, { eager: true, cascade: true, onUpdate: 'CASCADE' })
    @JoinColumn()
    mappings: MappingEntity[];

    @Column({ nullable: true })
    result: string;
}
