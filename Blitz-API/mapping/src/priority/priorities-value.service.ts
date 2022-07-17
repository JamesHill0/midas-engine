import { Injectable } from '@nestjs/common';
import { getConnection, createConnection, Repository } from 'typeorm';
import { PriorityValue, PriorityValueCollection, PriorityValueEntity } from './entities/priority-value.entity';
import { PriorityValueDto } from './dto/priority-value.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { ConfigurationsService } from 'src/configurations/configurations.service';

@Injectable()
export class PrioritiesValueService {
    constructor(
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<PrioritiesValueConfig> {
        let config = await this.configurationsService.get('mapping');
        let conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new PrioritiesValueFireorm(conn);
        } else {
            return new PrioritiesValueTypeorm(conn);
        }
    }

    public async findAll(query: any): Promise<PriorityValue[]> {
        const repository = await this.connection();
        return repository.findAll(query);
    }

    public async findById(id: string): Promise<PriorityValue | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async findByPriorityId(id: string): Promise<PriorityValue[]> {
        const repository = await this.connection();
        return await repository.findByPriorityId(id);
    }

    public async create(dto: PriorityValueDto): Promise<PriorityValue> {
        const repository = await this.connection();
        return await repository.create(dto);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<PriorityValue | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface PrioritiesValueConfig {
    findAll(query: any): Promise<PriorityValue[]>;
    findById(id: string): Promise<PriorityValue | null>;
    findByPriorityId(id: string): Promise<PriorityValue[]>;
    create(dto: PriorityValueDto): Promise<PriorityValue>;
    update(id: string, newValue: any): Promise<PriorityValue | null>;
    delete(id: string);
}

class PrioritiesValueTypeorm implements PrioritiesValueConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<Repository<PriorityValueEntity>> {
        try {
            const db = getConnection(this.connection['name']);
            return db.getRepository(PriorityValueEntity);
        } catch (e) {
            const db = await createConnection(this.connection);
            return db.getRepository(PriorityValueEntity);
        }
    }

    public async findAll(query: any): Promise<PriorityValue[]> {
        const repository = await this.repository();
        let selectQueryBuilder = repository.createQueryBuilder('priority-values');

        let limit = 0;
        if (query.limit) {
            if (isNaN(query.limit)) {
                limit = 0;
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

        if (limit == 0) {
            return await selectQueryBuilder.getMany();
        }
        return await selectQueryBuilder.limit(limit).getMany();
    }

    public async findById(id: string): Promise<PriorityValue | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    private async findByKey(key: string): Promise<PriorityValue[]> {
        const repository = await this.repository();
        return await repository.find({ 'key': key });
    }

    public async findByPriorityId(id: string): Promise<PriorityValue[]> {
        const repository = await this.repository();
        return await repository.find({ 'priorityId': id });
    }

    public async create(dto: PriorityValueDto): Promise<PriorityValue> {
        const repository = await this.repository();
        const results = await this.findByKey(dto.key);

        if (results.length > 0) {
            const priorityValue = results[0];
            return await this.update(priorityValue.id, dto);
        }
        return await repository.save(dto);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<PriorityValue | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Auto Mapping Value doesn't exist");
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

class PrioritiesValueFireorm implements PrioritiesValueConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<fireorm.BaseFirestoreRepository<PriorityValueCollection> | null> {
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

        return fireorm.getRepository(PriorityValueCollection);
    }

    public async findAll(): Promise<PriorityValue[]> {
        let priorityValues = [];

        const repository = await this.repository();
        let result = await repository.find();
        await Promise.all(result.map(async (res) => {
            priorityValues.push(new PriorityValue(res));
        }));

        return priorityValues;
    }

    public async findById(id: string): Promise<PriorityValue | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);

        return new PriorityValue(result);
    }

    public async findByPriorityId(id: string): Promise<PriorityValue[]> {
        let priorityValues = [];

        const repository = await this.repository();
        let result = await repository.whereEqualTo('priorityId', id).find();
        await Promise.all(result.map(async (res) => {
            priorityValues.push(new PriorityValue(res));
        }))

        return priorityValues
    }

    public async create(dto: PriorityValueDto): Promise<PriorityValue> {
        const repository = await this.repository();
        let result = await repository.create(dto);

        return new PriorityValue(result);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<PriorityValue | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Priority Value doesn't exist");
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