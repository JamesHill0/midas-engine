import { Injectable } from '@nestjs/common';
import { getConnection, createConnection, Repository } from 'typeorm';
import { PriorityFieldMappingValue, PriorityFieldMappingValueCollection, PriorityFieldMappingValueEntity } from './entities/priority.field.mapping.value.entity';
import { PriorityFieldMappingValueDto } from './dto/priority.field.mapping.value.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { ConfigurationsService } from 'src/configurations/configurations.service';

@Injectable()
export class PriorityFieldMappingValuesService {
    constructor(
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<PriorityFieldMappingValuesConfig> {
        let config = await this.configurationsService.get('mapping');
        let conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new PriorityFieldMappingValuesFireorm(conn);
        } else {
            return new PriorityFieldMappingValuesTypeorm(conn);
        }
    }

    public async findAll(query: any): Promise<PriorityFieldMappingValue[]> {
        const repository = await this.connection();
        return repository.findAll(query);
    }

    public async findById(id: string): Promise<PriorityFieldMappingValue | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async findByPriorityId(id: string): Promise<PriorityFieldMappingValue[]> {
        const repository = await this.connection();
        return await repository.findByPriorityId(id);
    }

    public async create(dto: PriorityFieldMappingValueDto): Promise<PriorityFieldMappingValue> {
        const repository = await this.connection();
        return await repository.create(dto);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<PriorityFieldMappingValue | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface PriorityFieldMappingValuesConfig {
    findAll(query: any): Promise<PriorityFieldMappingValue[]>;
    findById(id: string): Promise<PriorityFieldMappingValue | null>;
    findByPriorityId(id: string): Promise<PriorityFieldMappingValue[]>;
    create(dto: PriorityFieldMappingValueDto): Promise<PriorityFieldMappingValue>;
    update(id: string, newValue: any): Promise<PriorityFieldMappingValue | null>;
    delete(id: string);
}

class PriorityFieldMappingValuesTypeorm implements PriorityFieldMappingValuesConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<Repository<PriorityFieldMappingValueEntity>> {
        try {
            const db = getConnection(this.connection['name']);
            return db.getRepository(PriorityFieldMappingValueEntity);
        } catch (e) {
            const db = await createConnection(this.connection);
            return db.getRepository(PriorityFieldMappingValueEntity);
        }
    }

    public async findAll(query: any): Promise<PriorityFieldMappingValue[]> {
        const repository = await this.repository();
        const queryBuilderName = 'priority-field-mapping-values';
        let selectQueryBuilder = repository.createQueryBuilder(queryBuilderName);

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
            selectQueryBuilder = selectQueryBuilder.where(`${queryBuilderName}.${q.type} = :value`, { value: q.value });
        })

        if (limit == 0) {
            return await selectQueryBuilder.getMany();
        }
        return await selectQueryBuilder.limit(limit).getMany();
    }

    public async findById(id: string): Promise<PriorityFieldMappingValue | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    private async findByToField(toField: string): Promise<PriorityFieldMappingValue[]> {
        const repository = await this.repository();
        return await repository.find({ 'toField': toField });
    }

    public async findByPriorityId(id: string): Promise<PriorityFieldMappingValue[]> {
        const repository = await this.repository();
        return await repository.find({ 'priorityId': id });
    }

    public async create(dto: PriorityFieldMappingValueDto): Promise<PriorityFieldMappingValue> {
        const repository = await this.repository();
        const results = await this.findByToField(dto.toField);

        if (results.length > 0) {
            const priorityFieldMappingValues = results[0];
            return await this.update(priorityFieldMappingValues.id, dto);
        }
        return await repository.save(dto);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<PriorityFieldMappingValue | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Priority Field Mapping Value doesn't exist");
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

class PriorityFieldMappingValuesFireorm implements PriorityFieldMappingValuesConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<fireorm.BaseFirestoreRepository<PriorityFieldMappingValueCollection> | null> {
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

        return fireorm.getRepository(PriorityFieldMappingValueCollection);
    }

    public async findAll(): Promise<PriorityFieldMappingValue[]> {
        let priorityFieldMappingValues = [];

        const repository = await this.repository();
        let result = await repository.find();
        await Promise.all(result.map(async (res) => {
            priorityFieldMappingValues.push(new PriorityFieldMappingValue(res));
        }));

        return priorityFieldMappingValues;
    }

    public async findById(id: string): Promise<PriorityFieldMappingValue | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);

        return new PriorityFieldMappingValue(result);
    }

    public async findByPriorityId(id: string): Promise<PriorityFieldMappingValue[]> {
        let priorityFieldMappingValues = [];

        const repository = await this.repository();
        let result = await repository.whereEqualTo('priorityId', id).find();
        await Promise.all(result.map(async (res) => {
          priorityFieldMappingValues.push(new PriorityFieldMappingValue(res));
        }))

        return priorityFieldMappingValues
    }

    public async create(dto: PriorityFieldMappingValueDto): Promise<PriorityFieldMappingValue> {
        const repository = await this.repository();
        let result = await repository.create(dto);

        return new PriorityFieldMappingValue(result);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<PriorityFieldMappingValue | null> {
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
