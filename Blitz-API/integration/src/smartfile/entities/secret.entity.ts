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
    type: AuthType;

    @Column()
    key: string;
}
