import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

import { MessageType } from 'src/enums/message.type';
import { Collection } from 'fireorm';

export class Account {
  id: string;
  accountId: string;
  type: MessageType;
  message: string;

  constructor(partial: any) {
    Object.assign(this, partial);
  }
}

@Collection('account')
export class AccountCollection {
  id: string;
  accountId: string;
  type: MessageType;
  message: string;
}

@Entity('account')
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  accountId: string;

  @Column()
  type: MessageType;

  @Column()
  message: string;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
