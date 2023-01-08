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

export class Account {
    id: string;
    name: string;
    currentJob: JobType;
    protected: boolean;
    externalId: string;
    mappings: Mapping[];

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('account')
export class AccountCollection {
    id: string;
    name: string;
    currentJob: JobType;
    protected: boolean;
    externalId: string;
    mappings: MappingCollection[];
}

@Entity('account')
export class AccountEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ unique: true })
    name: string;

    @Column()
    currentJob: JobType;

    @Column()
    protected: boolean;

    @Column()
    externalId: string;

    @OneToMany(() => MappingEntity, mapping => mapping.account, { eager: true, cascade: true, onUpdate: 'CASCADE' })
    @JoinColumn()
    mappings: MappingEntity[];
}
