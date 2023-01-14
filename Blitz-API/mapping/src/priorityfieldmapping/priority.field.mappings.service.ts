import { Injectable } from '@nestjs/common';
import { getConnection, createConnection, Repository } from 'typeorm';
import { PriorityFieldMapping, PriorityFieldMappingCollection, PriorityFieldMappingEntity } from './entities/priority.field.mapping.entity';
import { PriorityFieldMappingDto } from './dto/priority.field.mapping.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { PriorityFieldMappingValuesService } from './priority.field.mapping.values.service';
import { PriorityFieldMappingValueDto } from './dto/priority.field.mapping.value.dto';
import { PriorityFieldMappingValueCollection } from './entities/priority.field.mapping.value.entity';

@Injectable()
export class PriorityFieldMappingsService {
    constructor(
        private readonly priorityFieldMappingValuesService: PriorityFieldMappingValuesService,
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<PriorityFieldMappingsConfig> {
        let config = await this.configurationsService.get('mapping');
        let conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new PriorityFieldMappingsFireorm(conn, this.priorityFieldMappingValuesService);
        } else {
            return new PriorityFieldMappingsTypeorm(conn, this.priorityFieldMappingValuesService);
        }
    }

    public async findAll(query: any): Promise<PriorityFieldMapping[]> {
        const repository = await this.connection();
        return repository.findAll(query);
    }

    public async findById(id: string): Promise<PriorityFieldMapping | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async create(dto: PriorityFieldMappingDto): Promise<PriorityFieldMapping> {
        const repository = await this.connection();
        return await repository.create(dto);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<PriorityFieldMapping | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface PriorityFieldMappingsConfig {
    findAll(query: any): Promise<PriorityFieldMapping[]>;
    findById(id: string): Promise<PriorityFieldMapping | null>;
    create(dto: PriorityFieldMappingDto): Promise<PriorityFieldMapping>;
    update(id: string, newValue: any): Promise<PriorityFieldMapping | null>;
    delete(id: string);
}

class PriorityFieldMappingsTypeorm implements PriorityFieldMappingsConfig {
    constructor(
        private connection: any,
        private readonly priorityFieldMappingValuesService: PriorityFieldMappingValuesService
    ) { }

    private async repository(): Promise<Repository<PriorityFieldMappingEntity>> {
        try {
            const db = getConnection(this.connection['name']);
            return db.getRepository(PriorityFieldMappingEntity);
        } catch (e) {
            const db = await createConnection(this.connection);
            return db.getRepository(PriorityFieldMappingEntity);
        }
    }

    public async findAll(query: any): Promise<PriorityFieldMapping[]> {
        const repository = await this.repository();
        let selectQueryBuilder = repository.createQueryBuilder('priority-field-mappings').leftJoinAndSelect('priority-field-mappings.values', 'priority-field-mapping-values');

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
                    let typ = key.split('_');
                    typ.shift()
                    queries.push({ type: typ.join('_'), value: value});
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

    public async findById(id: string): Promise<PriorityFieldMapping | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    private async findByFromField(fromField: string): Promise<PriorityFieldMapping[]> {
        const repository = await this.repository();
        return await repository.find({ 'fromField': fromField });
    }

    public async create(dto: PriorityFieldMappingDto): Promise<PriorityFieldMapping> {
        const repository = await this.repository();
        const results = await this.findByFromField(dto.fromField);

        if (results.length > 0) {
            const priority = results[0];
            await Promise.all(dto.values.map(async (value) => {
                value.priorityId = priority.id;
                await this.priorityFieldMappingValuesService.create(value);
            }));
            return await this.update(priority.id, { 'fromField': dto.fromField });
        }
        return await repository.save(dto);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<PriorityFieldMapping | null> {
        const data = await this.findById(id);
        if (!data.id) {
            //tslint:disable-next-line:no-console
            console.error("Priority Field Mapping doesn't exist");
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

class PriorityFieldMappingsFireorm implements PriorityFieldMappingsConfig {
    constructor(
        private connection: any,
        private readonly priorityFieldMappingValuesService: PriorityFieldMappingValuesService
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

    private async repository(): Promise<fireorm.BaseFirestoreRepository<PriorityFieldMappingCollection> | null> {
        await this.initialize();
        return fireorm.getRepository(PriorityFieldMappingCollection);
    }

    public async findAll(): Promise<PriorityFieldMapping[]> {
        let priorities = [];

        const repository = await this.repository();
        let result = await repository.find();
        await Promise.all(result.map(async (res) => {
            res.values = await this.priorityFieldMappingValuesService.findByPriorityId(res.id);
            priorities.push(new PriorityFieldMapping(res));
        }));

        return priorities;
    }

    public async findById(id: string): Promise<PriorityFieldMapping | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);

        result.values = await this.priorityFieldMappingValuesService.findByPriorityId(result.id);

        return new PriorityFieldMapping(result);
    }

    private async createMappingValue(dto: PriorityFieldMappingValueDto): Promise<PriorityFieldMapping> {
        await this.initialize();
        const repository = fireorm.getRepository(PriorityFieldMappingValueCollection);
        let result = await repository.create(dto);
        return new PriorityFieldMapping(result);
    }

    public async create(dto: PriorityFieldMappingDto): Promise<PriorityFieldMapping> {
        const repository = await this.repository();

        let values = dto.values;
        dto.values = null;
        let result = await repository.create(dto);

        // Create values
        if (values.length > 0) {
            await Promise.all(values.map(async (res) => {
                res.priorityId = dto.id;
                await this.createMappingValue(res);
            }))
        }

        result = await this.findById(result.id);
        return new PriorityFieldMapping(result);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<PriorityFieldMapping | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Auto Mapping doesn't exist");
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
