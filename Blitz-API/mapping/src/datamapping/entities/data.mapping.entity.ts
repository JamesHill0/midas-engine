import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

import { Collection } from 'fireorm';
import { DataFormatType } from 'src/enums/data.format.type';

export class DataMapping {
  id: string;
  externalId: string;
  toField: string;
  formatType: DataFormatType;
  formatting: string;

  constructor(partial: any) {
    Object.assign(this, partial);
  }
}

@Collection('data-mappings')
export class DataMappingCollection {
  id: string;
  externalId: string;
  toField: string;
  formatType: DataFormatType;
  formatting: string;
}

@Entity('data-mappings')
export class DataMappingEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  externalId: string;

  @Column()
  toField: string;

  @Column()
  formatType: DataFormatType;

  @Column()
  formatting: string;

  constructor(partial: any) {
    Object.assign(this, partial);
  }
}
