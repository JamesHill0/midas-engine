import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

import { MessageType } from 'src/enums/message.type';
import { Collection } from 'fireorm';

export class App {
    id: string;
    name: string;
    type: MessageType;
    mode: string;
    message: string;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('app')
export class AppCollection {
    id: string;
    name: string;
    type: MessageType;
    mode: string;
    message: string;
}

@Entity('app')
export class AppEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    type: MessageType;

    @Column()
    mode: string;

    @Column()
    message: string;

    @CreateDateColumn()
    Created!: Date;

    @UpdateDateColumn()
    Updated!: Date;

    @DeleteDateColumn()
    DeletedAt?: Date;
}