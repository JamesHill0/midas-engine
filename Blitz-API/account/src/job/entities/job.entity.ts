import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

import { JobStatusType } from 'src/enums/job.status.type';
import { Collection } from 'fireorm';

@Entity('job')
export class Job {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  status: JobStatusType;

  @CreateDateColumn()
  Created!: Date;

  @UpdateDateColumn()
  Updated!: Date;
}
