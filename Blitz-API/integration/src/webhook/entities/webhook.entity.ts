import {
  Entity,
  PrimaryGeneratedColumn,
  Column, OneToOne, JoinColumn
} from 'typeorm';

import { Collection } from 'fireorm';
import { StatusType } from 'src/enums/status.type';

export class Webhook {
  id: string;

  status: StatusType;

  constructor(partial: any) {
    Object.assign(this, partial);
  }
}

@Collection('webhook')
export class WebhookCollection {
  id: string;

  status: StatusType;
}

@Entity('webhook')
export class WebhookEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  status: StatusType;
}
