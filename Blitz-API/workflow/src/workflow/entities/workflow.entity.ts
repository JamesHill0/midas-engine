import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

import { Collection } from 'fireorm';

export class Workflow {
  id: string;

  constructor(partial: any) {
    Object.assign(this, partial)
  }
}

@Collection('workflow')
export class WorkflowCollection {
  id: string;
}

@Entity('workflow')
export class WorkflowEntity {
  @PrimaryGeneratedColumn()
  id: string;
}
