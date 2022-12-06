import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';
import { OrderStatusType } from 'src/enums/order.status.type';

import { Collection } from 'fireorm';

export class Order {
    id: string;
    status: string;
    price: number;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('order')
export class OrderCollection {
    id: string;
    status: string;
    price: number;
}

@Entity('order')
export class OrderEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    status: OrderStatusType;

    @Column()
    price: number;
}