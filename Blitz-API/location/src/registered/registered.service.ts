import { Injectable } from '@nestjs/common';
import { Registered, RegisteredCollection, RegisteredEntity } from './entities/registered.entity';
import { getConnection, Repository } from 'typeorm';
import { RegisteredDto } from './dto/registered.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { createConnection } from 'net';
import { ConfigurationsService } from 'src/configurations/configurations.service';

@Injectable()
export class RegisteredService {
    constructor(
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<RegisteredConfig> {
        let config = await this.configurationsService.get('client');
        let conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new RegisteredFireorm(conn);
        } else {
            return new RegisteredTypeorm(conn);
        }
    }

    public async findAll(query: any): Promise<Registered[]> {
        const repository = await this.connection();
        return repository.findAll(query);
    }

    public async findById(id: string): Promise<Registered | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async create(dto: RegisteredDto): Promise<Registered> {
        const repository = await this.connection();
        return await repository.create(dto);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<Registered | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface RegisteredConfig {
    findAll(query: any): Promise<Registered[]>;
    findById(id: string): Promise<Registered | null>;
    create(dto: RegisteredDto): Promise<Registered>;
    update(id: string, newValue: any): Promise<Registered | null>;
    delete(id: string);
}

class RegisteredTypeorm implements RegisteredConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<Repository<RegisteredEntity>> {
        try {
            const db = getConnection(this.connection['name']);
            return db.getRepository(RegisteredEntity);
        } catch (e) {
            const db = await createConnection(this.connection);
            return db.getRepository(RegisteredEntity);
        }
    }

    public async findAll(query: any): Promise<Registered[]> {
        const repository = await this.repository();
        let selectQueryBuilder = repository.createQueryBuilder('registered');

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

    public async findById(id: string): Promise<Registered | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    public async create(dto: RegisteredDto): Promise<Registered> {
        const repository = await this.repository();
        return await repository.save(dto);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<Registered | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Registered doesn't exist");
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

class RegisteredFireorm implements RegisteredConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<fireorm.BaseFirestoreRepository<RegisteredCollection> | null> {
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

        return fireorm.getRepository(RegisteredCollection);
    }

    public async findAll(): Promise<Registered[]> {
        let Registereds = [];

        const repository = await this.repository();
        let result = await repository.find();
        result.map((res) => {
            Registereds.push(new Registered(res));
        })

        return Registereds;
    }

    public async findById(id: string): Promise<Registered | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);

        return new Registered(result);
    }

    public async create(dto: RegisteredDto): Promise<Registered> {
        const repository = await this.repository();
        let result = await repository.create(dto);

        return new Registered(result);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<Registered | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Registered doesn't exist");
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