import { Injectable } from '@nestjs/common';
import { AccountMapping, AccountMappingCollection, AccountMappingEntity } from './entities/account.mapping.entity';
import { getConnection, createConnection, Repository } from 'typeorm';
import { AccountMappingDto } from './dto/account.mapping.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { Mapping, MappingCollection, MappingEntity } from 'src/mapping/entities/mapping.entity';
import { MappingsService } from 'src/mapping/mappings.service';

@Injectable()
export class AccountMappingsService {
    constructor(
        private readonly mappingsService: MappingsService,
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<AccountMappingsConfig> {
        let config = await this.configurationsService.get('mapping');
        let conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new AccountMappingsFireorm(conn, this.mappingsService);
        } else {
            return new AccountMappingsTypeorm(conn, this.mappingsService);
        }
    }

    public async findAll(query: any): Promise<AccountMapping[]> {
        const repository = await this.connection();
        return repository.findAll(query);
    }

    public async findById(id: string): Promise<AccountMapping | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async create(dto: AccountMappingDto): Promise<AccountMapping> {
        const repository = await this.connection();
        return await repository.create(dto);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<AccountMapping | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface AccountMappingsConfig {
    findAll(query: any): Promise<AccountMapping[]>;
    findById(id: string): Promise<AccountMapping | null>;
    create(dto: AccountMappingDto): Promise<AccountMapping>;
    update(id: string, newValue: any): Promise<AccountMapping | null>;
    delete(id: string);
}

class AccountMappingsTypeorm implements AccountMappingsConfig {
    constructor(
        private connection: any,
        private readonly mappingsService: MappingsService
    ) { }

    private async repository(): Promise<Repository<AccountMappingEntity>> {
        try {
            const db = getConnection(this.connection['name']);
            return db.getRepository(AccountMappingEntity);
        } catch (e) {
            const db = await createConnection(this.connection);
            return db.getRepository(AccountMappingEntity);
        }
    }

    public async findAll(query: any): Promise<AccountMapping[]> {
        const repository = await this.repository();
        const queryBuilderName = 'accounts';
        let selectQueryBuilder = repository.createQueryBuilder(queryBuilderName).leftJoinAndSelect(`${queryBuilderName}.mappings`, 'mappings');

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

    public async findById(id: string): Promise<AccountMapping | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    private async findByName(name: string): Promise<AccountMapping[]> {
        const repository = await this.repository();
        return await repository.find({ name: name });
    }

    public async create(dto: AccountMappingDto): Promise<AccountMapping> {
        const repository = await this.repository();
        const results = await this.findByName(dto.name);

        if (results.length > 0) {
            const account = results[0];
            await Promise.all(dto.mappings.map(async (mapping) => {
                mapping.accountId = account.id;
                await this.mappingsService.create(mapping);
            }));
            return await this.update(account.id, { 'name': dto.name, 'protected': dto.protected });
        }
        return await repository.save(dto);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<AccountMapping | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Account doesn't exist");
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

class AccountMappingsFireorm implements AccountMappingsConfig {
    constructor(
        private connection: any,
        private readonly mappingsService: MappingsService
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

    private async repository(): Promise<fireorm.BaseFirestoreRepository<AccountMappingCollection> | null> {
        await this.initialize();
        return fireorm.getRepository(AccountMappingCollection);
    }

    public async findAll(): Promise<AccountMapping[]> {
        let accounts = [];

        const repository = await this.repository();
        let result = await repository.find();
        await Promise.all(result.map(async (res) => {
            res.mappings = await this.mappingsService.findByAccountId(res.id);
            accounts.push(new AccountMapping(res));
        }));

        return accounts;
    }

    public async findById(id: string): Promise<AccountMapping | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);

        result.mappings = await this.mappingsService.findByAccountId(result.id);

        return new AccountMapping(result);
    }

    private async createMapping(dto: Mapping): Promise<Mapping> {
        await this.initialize();
        const repository = fireorm.getRepository(MappingCollection);
        let result = await repository.create(dto);
        return new Mapping(result);
    }

    public async create(dto: AccountMappingDto): Promise<AccountMapping> {
        const repository = await this.repository();

        let mappings = dto.mappings;
        dto.mappings = null;
        let result = await repository.create(dto);

        // Create mappings
        if (mappings.length > 0) {
            await Promise.all(mappings.map(async (res) => {
                res.accountId = dto.id;
                await this.createMapping(res);
            }))
        }

        result = await this.findById(result.id);
        return new AccountMapping(result);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<AccountMapping | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Account doesn't exist");
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
