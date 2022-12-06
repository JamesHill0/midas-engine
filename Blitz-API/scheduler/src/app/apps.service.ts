import { Injectable } from '@nestjs/common';
import { App, AppCollection, AppEntity } from './entities/app.entity';
import { getConnection, createConnection, Repository } from 'typeorm';
import { AppDto } from './dto/app.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { ConfigurationsService } from 'src/configurations/configurations.service';

@Injectable()
export class AppsService {
    constructor(
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<AppsConfig> {
        let config = await this.configurationsService.get('scheduler');
        let conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new AppsFireorm(conn);
        }
        return new AppsTypeorm(conn);
    }

    public async findAll(query: any): Promise<App[]> {
        const repository = await this.connection();
        return repository.findAll(query);
    }

    public async findById(id: string): Promise<App | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async findByName(name: string): Promise<App | null> {
        const repository = await this.connection();
        return await repository.findByName(name);
    }

    public async create(dto: AppDto): Promise<App> {
        const repository = await this.connection();
        return await repository.create(dto);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<App | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface AppsConfig {
    findAll(query: any): Promise<App[]>;
    findById(id: string): Promise<App | null>;
    findByName(name: string): Promise<App | null>;
    create(dto: AppDto): Promise<App>;
    update(id: string, newValue: any): Promise<App | null>;
    delete(id: string);
}

class AppsTypeorm implements AppsConfig {
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
        let selectQueryBuilder = repository.createQueryBuilder('apps');

        let limit = 500;
        if (query.limit) {
            if (isNaN(query.limit)) {
                limit = 500;
            }
            limit = Number(query.limit);
        }

        let queries = [];
        Object.entries(query).forEach(
            ([key, value]) => {
                if (key.substring(0, 2) == 'q_') {
                    const typ = key.split('_');
                    queries.push({ type: typ[1], value: value });
                }
            }
        )

        queries.map((q) => {
            selectQueryBuilder = selectQueryBuilder.where(`${q.type} = :value`, { value: q.value });
        })

        return await selectQueryBuilder.limit(limit).getMany();
    }

    public async findById(id: string): Promise<App | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    public async findByName(name: string): Promise<App | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail({name: name});
    }

    public async create(dto: AppDto): Promise<App> {
        const repository = await this.repository();
        return await repository.save(dto);
    }

    public async update(id: string, newValue: any): Promise<App | null> {
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

class AppsFireorm implements AppsConfig {
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

    private async repository(): Promise<fireorm.BaseFirestoreRepository<AppCollection> | null> {
        await this.initialize();
        return fireorm.getRepository(AppCollection);
    }

    public async findAll(): Promise<App[]> {
        let apps = [];

        const repository = await this.repository();
        let result = await repository.find();
        result.map((res) => {
            apps.push(new App(res));
        })

        return apps;
    }

    public async findById(id: string): Promise<App | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);

        return new App(result);
    }

    public async findByName(name: string): Promise<App | null> {
        const repository = await this.repository();
        let result = await repository.whereEqualTo('name', name).find();;

        return new App(result[0]);
    }

    public async create(dto: AppDto): Promise<App> {
        const repository = await this.repository();
        let result = await repository.create(dto);

        return new App(result);
    }

    public async update(id: string, newValue: any): Promise<App | null> {
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
