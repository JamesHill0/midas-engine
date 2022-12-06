import { Injectable } from '@nestjs/common';
import { getConnection, createConnection, Repository } from 'typeorm';
import { Priority, PriorityCollection, PriorityEntity } from './entities/priority.entity';
import { PriorityDto } from './dto/priority.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { PrioritiesValueService } from './priorities-value.service';
import { PriorityValueDto } from './dto/priority-value.dto';
import { PriorityValueCollection } from './entities/priority-value.entity';

@Injectable()
export class PrioritiesService {
    constructor(
        private readonly prioritiesValueService: PrioritiesValueService,
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<PrioritiesConfig> {
        let config = await this.configurationsService.get('mapping');
        let conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new PrioritiesFireorm(conn, this.prioritiesValueService);
        } else {
            return new PrioritiesTypeorm(conn, this.prioritiesValueService);
        }
    }

    public async findAll(query: any): Promise<Priority[]> {
        const repository = await this.connection();
        return repository.findAll(query);
    }

    public async findById(id: string): Promise<Priority | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async create(dto: PriorityDto): Promise<Priority> {
        const repository = await this.connection();
        return await repository.create(dto);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<Priority | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface PrioritiesConfig {
    findAll(query: any): Promise<Priority[]>;
    findById(id: string): Promise<Priority | null>;
    create(dto: PriorityDto): Promise<Priority>;
    update(id: string, newValue: any): Promise<Priority | null>;
    delete(id: string);
}

class PrioritiesTypeorm implements PrioritiesConfig {
    constructor(
        private connection: any,
        private readonly prioritiesValueService: PrioritiesValueService
    ) { }

    private async repository(): Promise<Repository<PriorityEntity>> {
        try {
            const db = getConnection(this.connection['name']);
            return db.getRepository(PriorityEntity);
        } catch (e) {
            const db = await createConnection(this.connection);
            return db.getRepository(PriorityEntity);
        }
    }

    public async findAll(query: any): Promise<Priority[]> {
        const repository = await this.repository();
        let selectQueryBuilder = repository.createQueryBuilder('priorities').leftJoinAndSelect('priorities.values', 'priority-value');

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

    public async findById(id: string): Promise<Priority | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    private async findByKey(key: string): Promise<Priority[]> {
        const repository = await this.repository();
        return await repository.find({ key: key });
    }

    public async create(dto: PriorityDto): Promise<Priority> {
        const repository = await this.repository();
        const results = await this.findByKey(dto.key);

        if (results.length > 0) {
            const priority = results[0];
            await Promise.all(dto.values.map(async (value) => {
                value.priorityId = priority.id;
                await this.prioritiesValueService.create(value);
            }));
            return await this.update(priority.id, { 'key': dto.key });
        }
        return await repository.save(dto);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<Priority | null> {
        const data = await this.findById(id);
        if (!data.id) {
            //tslint:disable-next-line:no-console
            console.error("Priority Mapping doesn't exist");
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

class PrioritiesFireorm implements PrioritiesConfig {
    constructor(
        private connection: any,
        private readonly prioritiesValueService: PrioritiesValueService
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

    private async repository(): Promise<fireorm.BaseFirestoreRepository<PriorityCollection> | null> {
        await this.initialize();
        return fireorm.getRepository(PriorityCollection);
    }

    public async findAll(): Promise<Priority[]> {
        let priorities = [];

        const repository = await this.repository();
        let result = await repository.find();
        await Promise.all(result.map(async (res) => {
            res.values = await this.prioritiesValueService.findByPriorityId(res.id);
            priorities.push(new Priority(res));
        }));

        return priorities;
    }

    public async findById(id: string): Promise<Priority | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);

        result.values = await this.prioritiesValueService.findByPriorityId(result.id);

        return new Priority(result);
    }

    private async createMappingValue(dto: PriorityValueDto): Promise<Priority> {
        await this.initialize();
        const repository = fireorm.getRepository(PriorityValueCollection);
        let result = await repository.create(dto);
        return new Priority(result);
    }

    public async create(dto: PriorityDto): Promise<Priority> {
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
        return new Priority(result);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<Priority | null> {
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