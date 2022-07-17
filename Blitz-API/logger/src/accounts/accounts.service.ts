import { Injectable } from '@nestjs/common';
import { Account, AccountEntity, AccountCollection } from './entities/account.entity';
import { getConnection, createConnection, Repository } from 'typeorm';
import { AccountDto } from './dto/account.dto';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';

import { ConfigurationsService } from 'src/configurations/configurations.service';
import { CredentialType } from 'src/enums/credential.type';

@Injectable()
export class AccountsService {
    constructor(
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<AccountConfig> {
        const config = await this.configurationsService.get('logger');
        const conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new AccountFireorm(conn);
        } else {
            return new AccountTypeorm(conn);
        }
    }

    public async findAll(query: any): Promise<Account[]> {
        const repository = await this.connection();
        return await repository.findAll(query);
    }

    public async findById(id: string): Promise<Account | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async create(dto: AccountDto): Promise<Account> {
        const repository = await this.connection();
        return await repository.create(dto);
    }

    public async update(id: string, newValue: any): Promise<Account | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface AccountConfig {
    findAll(query: any): Promise<Account[]>;
    findById(id: string): Promise<Account | null>;
    create(dto: AccountDto): Promise<Account>;
    update(id: string, newValue: any): Promise<Account | null>;
    delete(id: string);
}

class AccountTypeorm implements AccountConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<Repository<AccountEntity>> {
        try {
            const db = getConnection(this.connection['name']);
            return db.getRepository(AccountEntity);
        } catch (e) {
            const db = await createConnection(this.connection);
            return db.getRepository(AccountEntity);
        }
    }

    public async findAll(query: any): Promise<Account[]> {
        const repository = await this.repository();
        let selectQueryBuilder = repository.createQueryBuilder('accounts');

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

    public async findById(id: string): Promise<Account | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    private async save(dto: AccountDto): Promise<Account> {
        const repository = await this.repository();
        return await repository.save(dto);
    }

    public async create(dto: AccountDto): Promise<Account> {
        return await this.save(dto);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<Account | null> {
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

class AccountFireorm implements AccountConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<fireorm.BaseFirestoreRepository<AccountCollection> | null> {
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

        return fireorm.getRepository(AccountCollection);
    }

    public async findAll(): Promise<Account[]> {
        let accounts = [];

        const repository = await this.repository();
        let result = await repository.find();
        result.map((res) => {
            accounts.push(new Account(res));
        });

        return accounts;
    }

    public async findById(id: string): Promise<Account | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);

        return new Account(result);
    }

    private async save(dto: AccountDto): Promise<Account> {
        const repository = await this.repository();
        let result = await repository.create(dto);

        return new Account(result);
    }

    public async create(dto: AccountDto): Promise<Account> {
        return await this.save(dto);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<Account | null> {
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