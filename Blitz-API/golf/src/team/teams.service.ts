import { Injectable } from '@nestjs/common';
import { Team, TeamCollection, TeamEntity } from './entities/team.entity';
import { getConnection, Repository } from 'typeorm';
import { TeamDto } from './dto/team.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { createConnection } from 'net';
import { ConfigurationsService } from 'src/configurations/configurations.service';

@Injectable()
export class TeamsService {
    constructor(
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<TeamsConfig> {
        let config = await this.configurationsService.get('client');
        let conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new TeamsFireorm(conn);
        } else {
            return new TeamsTypeorm(conn);
        }
    }

    public async findAll(): Promise<Team[]> {
        const repository = await this.connection();
        return repository.findAll();
    }

    public async findById(id: string): Promise<Team | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async findByUserId(id: string): Promise<Team[]> {
        const repository = await this.connection();
        return await repository.findByUserId(id);
    }

    public async create(dto: TeamDto): Promise<Team> {
        const repository = await this.connection();
        return await repository.create(dto);
    }

    public async update(
        id: string,
        newValue: TeamDto,
    ): Promise<Team | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface TeamsConfig {
    findAll(): Promise<Team[]>;
    findById(id: string): Promise<Team | null>;
    findByUserId(id: string): Promise<Team[] | null>;
    create(dto: TeamDto): Promise<Team>;
    update(id: string, newValue: TeamDto): Promise<Team | null>;
    delete(id: string);
}

class TeamsTypeorm implements TeamsConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<Repository<TeamEntity>> {
        createConnection(this.connection);
        await getConnection().query("CREATE DATABASE IF NOT EXISTS");
        await getConnection().synchronize(true);
        return getConnection().getRepository(TeamEntity);
    }

    public async findAll(): Promise<Team[]> {
        const repository = await this.repository();
        return await repository.find();
    }

    public async findById(id: string): Promise<Team | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    public async findByUserId(id: string): Promise<Team[]> {
        const repository = await this.repository();
        return await repository.find({'userId': id});
    }

    public async create(dto: TeamDto): Promise<Team> {
        const repository = await this.repository();
        return await repository.save(dto);
    }

    public async update(
        id: string,
        newValue: TeamDto,
    ): Promise<Team | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Team doesn't exist");
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

class TeamsFireorm implements TeamsConfig {
    constructor(
        private connection: any
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

    private async repository(): Promise<fireorm.BaseFirestoreRepository<TeamCollection> | null> {
        await this.initialize();
        return fireorm.getRepository(TeamCollection);
    }

    public async findAll(): Promise<Team[]> {
        let teams = [];

        const repository = await this.repository();
        let result = await repository.find();
        await Promise.all(result.map((res) => {
            teams.push(new Team(res));
        }));

        return teams;
    }

    public async findById(id: string): Promise<Team | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);

        return new Team(result);
    }

    public async findByUserId(id: string): Promise<Team[]> {
        let teams = [];

        const repository = await this.repository();
        let result = await repository.whereEqualTo('userId', id).find();
        await Promise.all(result.map((res) => {
            teams.push(new Team(res));
        }));
    
        return teams;
    }

    public async create(dto: TeamDto): Promise<Team> {
        const repository = await this.repository();
        let result = await repository.create(dto);

        return new Team(result);
    }

    public async update(
        id: string,
        newValue: TeamDto,
    ): Promise<Team | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Team doesn't exist");
        }

        let updatedValue = new TeamCollection();
        Object.assign(data, newValue);
        Object.assign(updatedValue, data);

        const repository = await this.repository();
        await repository.update(updatedValue);
        return await this.findById(id);
    }

    public async delete(id: string) {
        const repository = await this.repository();
        await repository.delete(id);
    }
}