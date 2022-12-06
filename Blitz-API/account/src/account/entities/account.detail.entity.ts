import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';

@Entity('account-detail')
export class AccountDetail {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    address: string;
}
