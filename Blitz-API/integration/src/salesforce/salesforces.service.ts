import { Injectable } from '@nestjs/common';
import { Salesforce, SalesforceCollection, SalesforceEntity } from './entities/salesforce.entity';
import { getConnection, createConnection, Repository } from 'typeorm';
import { SalesforceDto } from './dto/salesforce.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { ConfigurationsService } from 'src/configurations/configurations.service';

@Injectable()
export class SalesforcesService {
    constructor(
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<SalesforcesConfig> {
        let config = await this.configurationsService.get('integration');
        let conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new SalesforcesFireorm(conn);
        } else {
            return new SalesforcesTypeorm(conn);
        }
    }

    public async findAll(): Promise<Salesforce[]> {
        const repository = await this.connection();
        return repository.findAll();
    }

    public async findById(id: string): Promise<Salesforce | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async create(dto: SalesforceDto): Promise<Salesforce> {
        const repository = await this.connection();
        const timestamp = Math.floor(Date.now() / 1000);
        dto.externalId = `EID-${timestamp}`;
        return await repository.create(dto);
    }

    public async update(
        id: string,
        newValue: SalesforceDto,
    ): Promise<Salesforce | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface SalesforcesConfig {
    findAll(): Promise<Salesforce[]>;
    findById(id: string): Promise<Salesforce | null>;
    create(dto: SalesforceDto): Promise<Salesforce>;
    update(id: string, newValue: SalesforceDto): Promise<Salesforce | null>;
    delete(id: string);
}

class SalesforcesTypeorm implements SalesforcesConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<Repository<SalesforceEntity>> {
        try {
            const db = getConnection(this.connection['name']);
            return db.getRepository(SalesforceEntity);
        } catch (e) {
            const db = await createConnection(this.connection);
            return db.getRepository(SalesforceEntity);
        }
    }

    public async findAll(): Promise<Salesforce[]> {
        const repository = await this.repository();
        return await repository.find();
    }

    public async findById(id: string): Promise<Salesforce | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    public async create(dto: SalesforceDto): Promise<Salesforce> {
        const repository = await this.repository();
        return await repository.save(dto);
    }

    public async update(
        id: string,
        newValue: SalesforceDto,
    ): Promise<Salesforce | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Salesforce doesn't exist");
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

class SalesforcesFireorm implements SalesforcesConfig {
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

    private async repository(): Promise<fireorm.BaseFirestoreRepository<SalesforceCollection> | null> {
        await this.initialize();
        return fireorm.getRepository(SalesforceCollection);
    }

    public async findAll(): Promise<Salesforce[]> {
        let salesforces = [];

        const repository = await this.repository();
        let result = await repository.find();
        await Promise.all(result.map(async (res) => {
            salesforces.push(new Salesforce(res));
        }));

        return salesforces;
    }

    public async findById(id: string): Promise<Salesforce | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);
        return new Salesforce(result);
    }

    public async create(dto: SalesforceDto): Promise<Salesforce> {
        const repository = await this.repository();
        let result = await repository.create(dto);

        return new Salesforce(result);
    }

    public async update(
        id: string,
        newValue: SalesforceDto,
    ): Promise<Salesforce | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Salesforce doesn't exist");
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
