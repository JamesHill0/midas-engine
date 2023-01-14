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
  editable: boolean;
  fromField: string;
  toField: string;
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
  editable: boolean;
  fromField: string;
  toField: string;
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
  editable: boolean;

  @Column()
  fromField: string;

  @Column()
  toField: string;

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
