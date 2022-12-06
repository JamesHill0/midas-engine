import {
  Entity,
  PrimaryGeneratedColumn,
  Column, OneToOne, JoinColumn
} from 'typeorm';

import { Collection } from 'fireorm';
import { StatusType } from 'src/enums/status.type';

export class Database {
  id: string;

  status: StatusType;

  constructor(partial: any) {
    Object.assign(this, partial);
  }
}

@Collection('database')
export class DatabaseCollection {
  id: string;

  status: StatusType;
}

@Entity('database')
export class DatabaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  status: StatusType;
}
