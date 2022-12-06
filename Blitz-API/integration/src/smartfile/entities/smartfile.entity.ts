import {
  Entity,
  PrimaryGeneratedColumn,
  Column, OneToOne, JoinColumn
} from 'typeorm';

import { Collection } from 'fireorm';
import { Secret } from './secret.entity';
import { StatusType } from 'src/enums/status.type';

export class SmartFile {
  id: string;

  status: StatusType;

  secret: Secret;

  constructor(partial: any) {
    Object.assign(this, partial);
  }
}

@Collection('smartfile')
export class SmartFileCollection {
  id: string;

  status: StatusType;

  secret: Secret;
}

@Entity('smartfile')
export class SmartFileEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  status: StatusType;

  @OneToOne(() => Secret, { eager: true, cascade: true })
  @JoinColumn()
  secret: Secret;
}
