import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

import { Collection } from 'fireorm';

export class WbEtl {
  id: string;

  uniqueId: string;

  externalId: string;

  data: any;

  constructor(partial: any) {
    Object.assign(this, partial);
  }
}

@Collection('wbetl')
export class WbEtlCollection {
  id: string;

  uniqueId: string;

  externalId: string;

  data: any;
}

@Entity('wbetl')
export class WbEtlEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  uniqueId: string;

  @Column()
  externalId: string;

  @Column({
    type: 'jsonb'
  })
  data: any;
}
