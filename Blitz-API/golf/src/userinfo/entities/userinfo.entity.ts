import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinColumn,
    ManyToMany,
    JoinTable,
    OneToOne,
} from 'typeorm';

import { Collection } from 'fireorm';

import { Game, GameCollection, GameEntity } from 'src/game/entities/game.entity';
import { Team, TeamCollection, TeamEntity } from 'src/team/entities/team.entity';

export class UserInfo {
    id: string;
    userId: string;
    name: string;
    handicap: number;
    longtitude: number;
    latitude: number;
    teams: Team[];
    games: Game[];

    constructor(partial: any) {
        Object.assign(this, partial);
    }
}

@Collection('userinfo')
export class UserInfoCollection {
    id: string;
    userId: string;
    name: string;
    handicap: number;
    longtitude: number;
    latitude: number;
    teams: TeamCollection[];
    games: GameCollection[];
}

@Entity('userinfo')
export class UserInfoEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    userId: string;

    @Column()
    name: string;

    @Column()
    handicap: number;

    @Column()
    longtitude: number;

    @Column()
    latitude: number;

    @OneToMany(() => TeamEntity, team => team.userId)
    teams: TeamEntity[];

    @OneToMany(() => GameEntity, game => game.userId)
    @JoinColumn()
    games: GameEntity[];
}