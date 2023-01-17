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

  data: string;

  constructor(partial: any) {
    Object.assign(this, partial);
  }
}

@Collection('wbetl')
export class WbEtlCollection {
  id: string;

  uniqueId: string;

  externalId: string;

  data: string;
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
  data: string;
}
