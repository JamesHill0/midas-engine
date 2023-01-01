import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

import { Collection } from 'fireorm';
import { StatusType } from 'src/enums/status.type';
import { MappingType } from 'src/enums/mapping.type';

export class Workflow {
  id: string;

  name: string;

  description: string;

  status: StatusType;

  mappingType: MappingType;

  constructor(partial: any) {
    Object.assign(this, partial)
  }
}

@Collection('workflow')
export class WorkflowCollection {
  id: string;

  name: string;

  description: string;

  status: StatusType;

  mappingType: MappingType;
}

@Entity('workflow')
export class WorkflowEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  status: StatusType;

  @Column()
  mappingType: MappingType;
}
