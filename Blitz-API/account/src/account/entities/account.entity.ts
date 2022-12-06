import { AccountType } from 'src/enums/account.type';
import { StatusType } from 'src/enums/status.type';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column, OneToOne, JoinColumn, OneToMany
} from 'typeorm';
import { AccountDetail  } from './account.detail.entity';
import { ContactDetail } from './contact.detail.entity';
import { Secret } from './secret.entity';

@Entity('account')
export class Account {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    number: string;

    @Column()
    name: string;

    @Column()
    type: AccountType;

    @Column()
    status: StatusType;

    @Column()
    apiKey: string;

    @Column()
    externalApiKey: string;

    @OneToOne(() => AccountDetail, { eager: true, cascade: true })
    @JoinColumn()
    detail: AccountDetail;

    @OneToMany(() => ContactDetail, contact => contact.accountId)
    contacts: ContactDetail[];

    @OneToOne(() => Secret, { eager: true, cascade: true })
    @JoinColumn()
    secret: Secret;
}
