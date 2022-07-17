import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import { Collection } from 'fireorm';
import { Account, AccountEntity } from 'src/account/entities/account.entity';

export class Mapping {
    id: string;
    accountId: string;
    origin: string;
    key: string;
    value: string;
    label: string;
    category: string;
    editable: boolean;

    constructor(partial: any) {
        Object.assign(this, partial)
    }
}

@Collection('mapping')
export class MappingCollection {
    id: string;
    accountId: string;
    origin: string;
    key: string;
    value: string;
    label: string;
    category: string;
    editable: boolean;
}

@Entity('mapping')
export class MappingEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    accountId: string;

    @Column({ unique: true })
    origin: string;

    @Column()
    key: string;

    @Column()
    value: string;

    @Column()
    label: string;

    @Column()
    category: string;

    @Column()
    editable: boolean;

    @ManyToOne(() => AccountEntity, account => account.mappings)
    @JoinColumn()
    account: AccountEntity;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}