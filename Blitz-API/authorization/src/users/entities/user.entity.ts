import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { StatusType } from 'src/enums/status.type';
import { Collection } from 'fireorm';

export class User {
    id: string;
    username: string;
    password: string;
    status: StatusType;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('user')
export class UserCollection {
    id: string;
    username: string;
    password: string;
    status: StatusType;
}

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    status: StatusType;
}