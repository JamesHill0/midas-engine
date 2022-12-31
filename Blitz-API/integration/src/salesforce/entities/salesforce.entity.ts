import {
    Entity,
    PrimaryGeneratedColumn,
    Column, OneToOne, JoinColumn
} from 'typeorm';

import { Collection } from 'fireorm';
import { StatusType } from 'src/enums/status.type';
import { Secret } from './secret.entity';

export class Salesforce {
    id: string;

    status: StatusType;

    secret: Secret;

    externalId: string;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('salesforce')
export class SalesforceCollection {
    id: string;

    status: StatusType;

    secret: Secret;

    externalId: string;
}

@Entity('salesforce')
export class SalesforceEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    status: StatusType;

    @OneToOne(() => Secret, { eager: true, cascade: true })
    @JoinColumn()
    secret: Secret;

    @Column()
    externalId: string;
}
