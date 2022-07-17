import { Injectable } from '@nestjs/common';
import { UserInfo, UserInfoCollection, UserInfoEntity } from './entities/userinfo.entity';
import { getConnection, Repository } from 'typeorm';
import { UserInfoDto } from './dto/userinfo.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { createConnection } from 'net';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { GamesService } from 'src/game/games.service';
import { TeamsService } from 'src/team/teams.service';

@Injectable()
export class UserInfosService {
    constructor(
        private readonly gamesService: GamesService,
        private readonly teamsService: TeamsService,
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<UserInfosConfig> {
        let config = await this.configurationsService.get('client');
        let conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new UserInfosFireorm(conn, this.teamsService, this.gamesService);
        } else {
            return new UserInfosTypeorm(conn);
        }
    }

    public async findAll(): Promise<UserInfo[]> {
        const repository = await this.connection();
        return repository.findAll();
    }

    public async findById(id: string): Promise<UserInfo | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async findByUserId(id: string): Promise<UserInfo | null> {
        const repository = await this.connection();
        return await repository.findByUserId(id);
    }

    public async create(dto: UserInfoDto): Promise<UserInfo> {
        const repository = await this.connection();
        return await repository.create(dto);
    }

    public async update(
        id: string,
        newValue: UserInfoDto,
    ): Promise<UserInfo | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface UserInfosConfig {
    findAll(): Promise<UserInfo[]>;
    findById(id: string): Promise<UserInfo | null>;
    findByUserId(id: string): Promise<UserInfo | null>;
    create(dto: UserInfo): Promise<UserInfo>;
    update(id: string, newValue: UserInfoDto): Promise<UserInfo | null>;
    delete(id: string);
}

class UserInfosTypeorm implements UserInfosConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<Repository<UserInfoEntity>> {
        createConnection(this.connection);
        await getConnection().query("CREATE DATABASE IF NOT EXISTS");
        await getConnection().synchronize(true);
        return getConnection().getRepository(UserInfoEntity);
    }

    public async findAll(): Promise<UserInfo[]> {
        const repository = await this.repository();
        return await repository.find();
    }

    public async findById(id: string): Promise<UserInfo | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    public async findByUserId(id: string): Promise<UserInfo | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail({'userId': id});
    }

    public async create(dto: UserInfoDto): Promise<UserInfo> {
        const repository = await this.repository();
        return await repository.save(dto);
    }

    public async update(
        id: string,
        newValue: UserInfoDto,
    ): Promise<UserInfo | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("User Info doesn't exist");
        }
        const repository = await this.repository();
        await repository.update(id, newValue);
        return await this.findById(id);
    }

    public async delete(id: string) {
        const repository = await this.repository();
        await repository.delete(id);
    }
}

class UserInfosFireorm implements UserInfosConfig {
    constructor(
        private connection: any,
        private teamsService: TeamsService,
        private gamesService: GamesService,
    ) { }

    private async initialize() {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(this.connection.key),
                databaseURL: `https://${this.connection.key.project_id}.firebaseio.com`
            });

            const firestore = admin.firestore();
            firestore.settings({
                timestampsInSnapshots: true
            });

            fireorm.initialize(firestore);
        }
    }

    private async repository(): Promise<fireorm.BaseFirestoreRepository<UserInfoCollection> | null> {
        await this.initialize();
        return fireorm.getRepository(UserInfoCollection);
    }

    public async findAll(): Promise<UserInfo[]> {
        let userinfos = [];

        const repository = await this.repository();
        let result = await repository.find();
        await Promise.all(result.map(async (res) => {
            res.games = await this.gamesService.findByUserId(res.userId);
            res.teams = await this.teamsService.findByUserId(res.userId);
            userinfos.push(new UserInfo(res));
        }));

        return userinfos;
    }

    public async findById(id: string): Promise<UserInfo | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);

        result.games = await this.gamesService.findByUserId(result.userId);
        result.teams = await this.teamsService.findByUserId(result.userId);

        return new UserInfo(result);
    }

    public async findByUserId(id: string): Promise<UserInfo | null> {
        const repository = await this.repository();
        let result = await repository.whereEqualTo('userId', id).findOne();

        result.games = await this.gamesService.findByUserId(result.userId);
        result.teams = await this.teamsService.findByUserId(result.userId);

        return new UserInfo(result);
    }

    public async create(dto: UserInfoDto): Promise<UserInfo> {
        const repository = await this.repository();
        let result = await repository.create(dto);

        return new UserInfo(result);
    }

    public async update(
        id: string,
        newValue: UserInfoDto,
    ): Promise<UserInfo | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("User Info doesn't exist");
        }
        const repository = await this.repository();
        await repository.update(newValue);
        return await this.findById(id);
    }

    public async delete(id: string) {
        const repository = await this.repository();
        await repository.delete(id);
    }
}