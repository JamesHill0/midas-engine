import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';
import { AuthType } from 'src/enums/auth.type';

@Entity('smartfile_secret')
export class Secret {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    domain: string;

    @Column()
    username: string;

    @Column()
    password: string;
}
