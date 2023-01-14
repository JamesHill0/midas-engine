import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

import { Collection } from 'fireorm';

export class DirectFieldMapping {
  id: string;
  externalId: string;
  fromField: string;
  toField: string;

  constructor(partial: any) {
    Object.assign(this, partial);
  }
}

@Collection('direct-field-mappings')
export class DirectFieldMappingCollection {
  id: string;
  externalId: string;
  fromField: string;
  toField: string;
}

@Entity('direct-field-mappings')
export class DirectFieldMappingEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  externalId: string;

  @Column()
  fromField: string;

  @Column()
  toField: string;

  constructor(partial: any) {
    Object.assign(this, partial);
  }
}
