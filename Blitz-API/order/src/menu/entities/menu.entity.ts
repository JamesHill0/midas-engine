import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';

import { Collection } from 'fireorm';

export class Menu {
    id: string;
    image: string;
    price: number;
    description: string;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('menu')
export class MenuCollection {
    id: string;
    image: string;
    price: number;
    description: string;
}

@Entity('menu')
export class MenuEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    image: string;

    @Column()
    price: number;

    @Column()
    description: string;
}