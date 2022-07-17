import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';
import { SellerType } from 'src/enums/seller.type';

import { Collection } from 'fireorm';

export class Seller {
    id: string;
    name: string;
    type: string;
    latitude: number;
    longtitude: number;
    photo: string;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('seller')
export class SellerCollection {
    id: string;
    name: string;
    type: string;
    latitude: number;
    longtitude: number;
    photo: string;
}

@Entity('seller')
export class SellerEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    type: SellerType;

    @Column()
    latitude: number;

    @Column()
    longtitude: number;

    @Column()
    photo: string;
}