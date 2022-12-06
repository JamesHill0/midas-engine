import { Injectable } from '@nestjs/common';
import { Mapping, MappingCollection, MappingEntity } from './entities/mapping.entity';
import { getConnection, createConnection, Repository } from 'typeorm';
import { MappingDto } from './dto/mapping.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { ConfigurationsService } from 'src/configurations/configurations.service';

@Injectable()
export class MappingsService {
    constructor(
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<MappingsConfig> {
        let config = await this.configurationsService.get('mapping');
        let conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new MappingsFireorm(conn);
        } else {
            return new MappingsTypeorm(conn);
        }
    }

    public async findAll(query: any): Promise<Mapping[]> {
        const repository = await this.connection();
        return repository.findAll(query);
    }

    public async findById(id: string): Promise<Mapping | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async findByAccountId(id: string): Promise<Mapping[]> {
        const repository = await this.connection();
        return await repository.findByAccountId(id);
    }

    public async create(dto: MappingDto): Promise<Mapping> {
        const repository = await this.connection();
        return await repository.create(dto);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<Mapping | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface MappingsConfig {
    findAll(query: any): Promise<Mapping[]>;
    findById(id: string): Promise<Mapping | null>;
    findByAccountId(id: string): Promise<Mapping[]>;
    create(dto: MappingDto): Promise<Mapping>;
    update(id: string, newValue: any): Promise<Mapping | null>;
    delete(id: string);
}

class MappingsTypeorm implements MappingsConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<Repository<MappingEntity>> {
        try {
            const db = getConnection(this.connection['name']);
            return db.getRepository(MappingEntity);
        } catch (e) {
            const db = await createConnection(this.connection);
            return db.getRepository(MappingEntity);
        }
    }

    public async findAll(query: any): Promise<Mapping[]> {
        const repository = await this.repository();
        let selectQueryBuilder = repository.createQueryBuilder('mappings');

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
        );

        queries.map((q) => {
            selectQueryBuilder = selectQueryBuilder.where(`${q.type} = :value`, { value: q.value });
        })

        return await selectQueryBuilder.limit(limit).getMany();
    }

    public async findById(id: string): Promise<Mapping | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    public async findByAccountId(id: string): Promise<Mapping[]> {
        const repository = await this.repository();
        return await repository.find({ 'accountId': id });
    }

    public async findKey(key: string): Promise<Mapping[]> {
        const repository = await this.repository();
        return await repository.find({key: key});
    }

    public async findOrigin(origin: string): Promise<Mapping[]> {
        const repository = await this.repository();
        return await repository.find({origin: origin});
    }

    public async create(dto: MappingDto): Promise<Mapping> {
        const repository = await this.repository();
        const results = await this.findOrigin(dto.origin);

        if (results.length > 0) {
            const mapping = results[0];
            dto.category = mapping.category;
            return await this.update(mapping.id, dto);
        }
        return await repository.save(dto);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<Mapping | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Mapping doesn't exist");
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

class MappingsFireorm implements MappingsConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<fireorm.BaseFirestoreRepository<MappingCollection> | null> {
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

        return fireorm.getRepository(MappingCollection);
    }

    public async findAll(): Promise<Mapping[]> {
        let mappings = [];

        const repository = await this.repository();
        let result = await repository.find();
        await Promise.all(result.map(async (res) => {
            mappings.push(new Mapping(res));
        }));

        return mappings;
    }

    public async findById(id: string): Promise<Mapping | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);

        return new Mapping(result);
    }

    public async findByAccountId(id: string): Promise<Mapping[]> {
        let mappings = [];

        const repository = await this.repository();
        let result = await repository.whereEqualTo('accountId', id).find();
        await Promise.all(result.map(async (res) => {
            mappings.push(new Mapping(res));
        }))

        return mappings
    }

    public async create(dto: MappingDto): Promise<Mapping> {
        const repository = await this.repository();
        let result = await repository.create(dto);

        return new Mapping(result);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<Mapping | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Mapping doesn't exist");
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