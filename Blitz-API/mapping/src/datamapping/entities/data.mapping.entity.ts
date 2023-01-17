import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn
} from 'typeorm';

import { Collection } from 'fireorm';
import { DataFormatType } from 'src/enums/data.format.type';
import { DataMappingOption, DataMappingOptionCollection, DataMappingOptionEntity } from './data.mapping.option.entity';

export class DataMapping {
  id: string;
  workflowId: string;
  externalId: string;
  toField: string;
  formatType: DataFormatType;
  formatting: string;
  options: DataMappingOption[];

  constructor(partial: any) {
    Object.assign(this, partial);
  }
}

@Collection('data-mappings')
export class DataMappingCollection {
  id: string;
  workflowId: string;
  externalId: string;
  toField: string;
  formatType: DataFormatType;
  formatting: string;
  options: DataMappingOptionCollection[];
}

@Entity('data-mappings')
export class DataMappingEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  workflowId: string;

  @Column()
  externalId: string;

  @Column()
  toField: string;

  @Column({ nullable: true })
  formatType: DataFormatType;

  @Column({ nullable: true })
  formatting: string;

  @OneToMany(() => DataMappingOptionEntity, value => value.dataMapping, { eager: true, cascade: true, onUpdate: 'CASCADE' })
  @JoinColumn()
  options: DataMappingOptionEntity[];

  constructor(partial: any) {
    Object.assign(this, partial);
  }
}
