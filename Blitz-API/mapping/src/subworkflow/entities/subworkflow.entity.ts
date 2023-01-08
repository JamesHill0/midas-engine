import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

import { Collection } from 'fireorm';
import { JobType } from 'src/enums/job.type';
import { IntegrationType } from 'src/enums/integration.type';
import { DirectionType } from 'src/enums/direction.type';

export class Subworkflow {
  id: string;

  workflowId: string

  jobType: JobType;

  directionType: DirectionType;

  integrationType: IntegrationType;

  integrationId: string;

  tableName: string;

  constructor(partial: any) {
    Object.assign(this, partial)
  }
}

@Collection('subworkflow')
export class SubworkflowCollection {
  id: string;

  workflowId: string;

  jobType: JobType;

  directionType: DirectionType;

  integrationType: IntegrationType;

  integrationId: string;

  tableName: string;
}

@Entity('subworkflow')
export class SubworkflowEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  workflowId: string;

  @Column()
  jobType: JobType;

  @Column()
  directionType: DirectionType;

  @Column()
  integrationType: IntegrationType;

  @Column()
  integrationId: string;

  @Column({ nullable: true })
  tableName: string;
}
