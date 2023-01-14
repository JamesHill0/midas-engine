import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import { Collection } from 'fireorm';
import { DataMapping } from './data.mapping.entity';

export class DataMappingOption {
  id: string;
  dataMappingId: string;
  fromData: string;
  toData: string;

  constructor(partial: any) {
    Object.assign(this, partial);
  }
}

@Collection('data-mapping-options')
export class DataMappingOptionCollection {
  id: string;
  dataMappingId: string;
  fromData: string;
  toData: string;
}

@Entity('data-mapping-options')
export class DataMappingOptionEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  dataMappingId: string;

  @Column()
  fromData: string;

  @Column()
  toData: string;

  @ManyToOne(() => DataMapping, dataMapping => dataMapping.options)
  @JoinColumn()
  dataMapping: DataMapping;

  constructor(partial: any) {
    Object.assign(this, partial);
  }
}
