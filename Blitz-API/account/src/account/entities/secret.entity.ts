import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';
import { CredentialType } from 'src/enums/credential.type';

@Entity('secret')
export class Secret {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    type: CredentialType;

    @Column()
    key: string;
}
