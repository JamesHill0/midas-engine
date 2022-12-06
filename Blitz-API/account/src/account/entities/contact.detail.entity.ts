import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';

@Entity('contact-detail')
export class ContactDetail {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    accountId: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    number: string;
}
