import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';
import { DeliveryStatusType } from 'src/enums/delivery.status.type';

import { Collection } from 'fireorm';

export class Delivery {
    id: string;
    status: string;
    latitude: number;
    longtitude: number;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('delivery')
export class DeliveryCollection {
    id: string;
    status: string;
    latitude: number;
    longtitude: number;
}

@Entity('delivery')
export class DeliveryEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    status: DeliveryStatusType;

    @Column()
    latitude: number;

    @Column()
    longtitude: number;
}