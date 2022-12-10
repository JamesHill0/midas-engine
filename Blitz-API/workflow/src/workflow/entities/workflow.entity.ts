import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

import { Collection } from 'fireorm';
import { StatusType } from 'src/enums/status.type';
import { WorkflowType } from 'src/enums/workflow.type';

export class Workflow {
  id: string;

  status: StatusType;

  workflowType: WorkflowType;

  constructor(partial: any) {
    Object.assign(this, partial)
  }
}

@Collection('workflow')
export class WorkflowCollection {
  id: string;

  status: StatusType;

  workflowType: WorkflowType;
}

@Entity('workflow')
export class WorkflowEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  status: StatusType;

  @Column()
  workflowType: WorkflowType;
}
