import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';
import { AuthType } from 'src/enums/auth.type';

@Entity('salesforce_secret')
export class Secret {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    url: string;

    @Column()
    securityToken: string;

    @Column()
    accessToken: string;

    @Column()
    instanceUrl: string;

    @Column()
    refreshToken: string;
}
