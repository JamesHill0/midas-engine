import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

import { Collection } from 'fireorm';
import { StatusType } from 'src/enums/status.type';

export class Workflow {
  id: string;

  name: string;

  description: string;

  status: StatusType;

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
}
