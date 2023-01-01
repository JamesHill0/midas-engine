import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Collection } from 'fireorm';
import { Account, AccountEntity } from 'src/account/entities/account.entity';
import { JobType } from 'src/enums/job.type';

export class Mapping {
  id: string;
  accountId: string;
  externalId: string;
  editable: boolean;
  currentJob: JobType;
  fromFieldName: string;
  toFieldName: string;
  fromData: string;
  toData: string;

  constructor(partial: any) {
    Object.assign(this, partial)
  }
}

@Collection('mapping')
export class MappingCollection {
  id: string;
  accountId: string;
  externalId: string;
  editable: boolean;
  currentJob: JobType;
  fromFieldName: string;
  toFieldName: string;
  fromData: string;
  toData: string;
}

@Entity('mapping')
export class MappingEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  accountId: string;

  @Column()
  externalId: string;

  @Column()
  editable: boolean;

  @Column()
  currentJob: JobType;

  @Column()
  fromFieldName: string;

  @Column()
  toFieldName: string;

  @Column()
  fromData: string;

  @Column()
  toData: string;

  @ManyToOne(() => AccountEntity, account => account.mappings)
  @JoinColumn()
  account: AccountEntity;

  constructor(partial: any) {
    Object.assign(this, partial);
  }
}
