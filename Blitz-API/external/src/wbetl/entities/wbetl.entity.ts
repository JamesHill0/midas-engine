import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

import { Collection } from 'fireorm';
import { StatusType } from 'src/enums/status.type';

export class WbEtl {
  id: string;

  status: StatusType;

  data: any;

  constructor(partial: any) {
    Object.assign(this, partial);
  }
}

@Collection('wbetl')
export class WbEtlCollection {
  id: string;

  status: StatusType;

  data: any;
}

@Entity('wbetl')
export class WbEtlEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  status: StatusType;

  @Column({
    type: 'jsonb'
  })
  data: any;
}
