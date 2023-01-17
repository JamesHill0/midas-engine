import { Injectable } from '@nestjs/common';
import { App, AppEntity, AppCollection } from './entities/app.entity';
import { getConnection, createConnection, Repository } from 'typeorm';
import { AppDto } from './dto/app.dto';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';

import { ConfigurationsService } from 'src/configurations/configurations.service';
import { CredentialType } from 'src/enums/credential.type';


@Injectable()
export class AppsService {
    constructor(
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<AppConfig> {
        const config = await this.configurationsService.get('logger');
        const conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new AppFireorm(conn);
        } else {
            return new AppTypeorm(conn);
        }
    }

    public async findAll(query: any): Promise<App[]> {
        const repository = await this.connection();
        return await repository.findAll(query);
    }

    public async findById(id: string): Promise<App | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async create(dto: AppDto): Promise<App> {
        const repository = await this.connection();
        return await repository.create(dto);
    }

    public async update(id: string, newValue: AppDto): Promise<App | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface AppConfig {
    findAll(query: any): Promise<App[]>;
    findById(id: string): Promise<App | null>;
    create(dto: AppDto): Promise<App>;
    update(id: string, newValue: AppDto): Promise<App | null>;
    delete(id: string);
}

class AppTypeorm implements AppConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<Repository<AppEntity>> {
        try {
            const db = getConnection(this.connection['name']);
            return db.getRepository(AppEntity);
        } catch (e) {
            const db = await createConnection(this.connection);
            return db.getRepository(AppEntity);
        }
    }

    public async findAll(query: any): Promise<App[]> {
        const repository = await this.repository();
        const queryBuilderName = 'apps';
        let selectQueryBuilder = repository.createQueryBuilder(queryBuilderName).orderBy(`${queryBuilderName}.Created`, 'DESC');

        let limit = 500;
        if (query.limit) {
            limit = query.limit;
        }

        let queries = [];
        Object.entries(query).forEach(
            ([key, value]) => {
                if (key.substring(0, 2) == 'q_') {
                    const typ = key.split('_');
                    queries.push({type: typ[1], value: value});
                }
            }
        );

        queries.map((q) => {
            selectQueryBuilder = selectQueryBuilder.where(`${queryBuilderName}.${q.type} = :value`, { value: q.value });
        })

        return await selectQueryBuilder.limit(limit).getMany();
    }

    public async findById(id: string): Promise<App | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    private async save(dto: AppDto): Promise<App> {
        const repository = await this.repository();
        return await repository.save(dto);
    }

    public async create(dto: AppDto): Promise<App> {
        return await this.save(dto);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<App | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("App doesn't exist");
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

class AppFireorm implements AppConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<fireorm.BaseFirestoreRepository<AppCollection> | null> {
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

        return fireorm.getRepository(AppCollection);
    }

    public async findAll(): Promise<App[]> {
        let apps = [];

        const repository = await this.repository();
        let result = await repository.find();
        result.map((res) => {
            apps.push(new App(res));
        });

        return apps;
    }

    public async findById(id: string): Promise<App | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);

        return new App(result);
    }

    private async save(dto: AppDto): Promise<App> {
        const repository = await this.repository();
        let result = await repository.create(dto);

        return new App(result);
    }

    public async create(dto: AppDto): Promise<App> {
        return await this.save(dto);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<App | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("App doesn't exist");
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
