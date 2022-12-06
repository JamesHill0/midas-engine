import { Injectable } from '@nestjs/common';
import { Mobile, MobileCollection, MobileEntity } from './entities/mobile.entity';
import { getConnection, Repository } from 'typeorm';
import { MobileDto } from './dto/mobile.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { createConnection } from 'net';
import { ConfigurationsService } from 'src/configurations/configurations.service';

@Injectable()
export class MobilesService {
    constructor(
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<MobileConfig> {
        let config = await this.configurationsService.get('client');
        let conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new MobileFireorm(conn);
        } else {
            return new MobileTypeorm(conn);
        }
    }

    public async findAll(query: any): Promise<Mobile[]> {
        const repository = await this.connection();
        return repository.findAll(query);
    }

    public async findById(id: string): Promise<Mobile | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async create(dto: MobileDto): Promise<Mobile> {
        const repository = await this.connection();
        return await repository.create(dto);
    }

    public async update(
        id: string,
        newValue: MobileDto,
    ): Promise<Mobile | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface MobileConfig {
    findAll(query: any): Promise<Mobile[]>;
    findById(id: string): Promise<Mobile | null>;
    create(dto: MobileDto): Promise<Mobile>;
    update(id: string, newValue: any): Promise<Mobile | null>;
    delete(id: string);
}

class MobileTypeorm implements MobileConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<Repository<MobileEntity>> {
        try {
            const db = getConnection(this.connection['name']);
            return db.getRepository(MobileEntity);
        } catch (e) {
            const db = await createConnection(this.connection);
            return db.getRepository(MobileEntity);
        }
    }

    public async findAll(query: any): Promise<Mobile[]> {
        const repository = await this.repository();
        let selectQueryBuilder = repository.createQueryBuilder('mobiles');

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

    public async findById(id: string): Promise<Mobile | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    public async create(dto: MobileDto): Promise<Mobile> {
        const repository = await this.repository();
        return await repository.save(dto);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<Mobile | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Mobile doesn't exist");
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

class MobileFireorm implements MobileConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<fireorm.BaseFirestoreRepository<MobileCollection> | null> {
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

        return fireorm.getRepository(MobileCollection);
    }

    public async findAll(): Promise<Mobile[]> {
        let mobiles = [];

        const repository = await this.repository();
        let result = await repository.find();
        result.map((res) => {
            mobiles.push(new Mobile(res));
        })

        return mobiles;
    }

    public async findById(id: string): Promise<Mobile | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);

        return new Mobile(result);
    }

    public async create(dto: MobileDto): Promise<Mobile> {
        const repository = await this.repository();
        let result = await repository.create(dto);

        return new Mobile(result);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<Mobile | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Mobile doesn't exist");
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