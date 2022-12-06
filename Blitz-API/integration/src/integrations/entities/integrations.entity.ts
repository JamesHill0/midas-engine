import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Collection } from 'fireorm';
import { StatusType } from '../../enums/status.type';
import { DirectionType } from '../../enums/direction.type';

export class Integration {
    id: string;

    name: string;

    status: StatusType

    direction: DirectionType

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('integration')
export class IntegrationCollection {
    id: string;

    name: string;

    status: StatusType;

    direction: DirectionType;
}

@Entity('integration')
export class IntegrationEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    status: StatusType;

    @Column()
    direction: DirectionType;
}
