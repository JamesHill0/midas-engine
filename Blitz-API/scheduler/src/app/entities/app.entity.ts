import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    DeleteDateColumn
} from 'typeorm';

import { Collection } from 'fireorm';
import { StatusType } from 'src/enums/status.type';

export class App {
    id: string;
    name: string;
    status: StatusType;

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('app')
export class AppCollection {
    id: string;
    name: string;
    status: StatusType;
}

@Entity('app')
export class AppEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ unique: true })
    name: string;

    @Column()
    status: StatusType;

    @CreateDateColumn()
    Created!: Date;

    @UpdateDateColumn()
    Updated!: Date;

    @DeleteDateColumn()
    DeletedAt?: Date;
}