import { Injectable } from '@nestjs/common';
import { SmartFile, SmartFileCollection, SmartFileEntity } from './entities/smartfile.entity';
import { getConnection, createConnection, Repository } from 'typeorm';
import { SmartFileDto } from './dto/smartfile.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { ConfigurationsService } from 'src/configurations/configurations.service';

import { StatusType } from '../enums/status.type';

@Injectable()
export class SmartFilesService {
    constructor(
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<SmartFilesConfig> {
        let config = await this.configurationsService.get('integration');
        let conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new SmartFilesFireorm(conn);
        } else {
            return new SmartFilesTypeorm(conn);
        }
    }

    public async findAll(): Promise<SmartFile[]> {
        const repository = await this.connection();
        return repository.findAll();
    }

    public async findById(id: string): Promise<SmartFile | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async create(dto: SmartFileDto): Promise<SmartFile> {
        const repository = await this.connection();
        dto.status = StatusType.ACTIVE
        const timestamp = Math.floor(Date.now() / 1000);
        dto.externalId = `EID-${timestamp}`;
        return await repository.create(dto);
    }

    public async update(
        id: string,
        newValue: SmartFileDto,
    ): Promise<SmartFile | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface SmartFilesConfig {
    findAll(): Promise<SmartFile[]>;
    findById(id: string): Promise<SmartFile | null>;
    create(dto: SmartFileDto): Promise<SmartFile>;
    update(id: string, newValue: SmartFileDto): Promise<SmartFile | null>;
    delete(id: string);
}

class SmartFilesTypeorm implements SmartFilesConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<Repository<SmartFileEntity>> {
        try {
            const db = getConnection(this.connection['name']);
            return db.getRepository(SmartFileEntity);
        } catch (e) {
            const db = await createConnection(this.connection);
            return db.getRepository(SmartFileEntity);
        }
    }

    public async findAll(): Promise<SmartFile[]> {
        const repository = await this.repository();
        return await repository.find();
    }

    public async findById(id: string): Promise<SmartFile | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    public async create(dto: SmartFileDto): Promise<SmartFile> {
        const repository = await this.repository();
        return await repository.save(dto);
    }

    public async update(
        id: string,
        newValue: SmartFileDto,
    ): Promise<SmartFile | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("SmartFile doesn't exist");
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

class SmartFilesFireorm implements SmartFilesConfig {
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

    private async repository(): Promise<fireorm.BaseFirestoreRepository<SmartFileCollection> | null> {
        await this.initialize();
        return fireorm.getRepository(SmartFileCollection);
    }

    public async findAll(): Promise<SmartFile[]> {
        let smartFiles = [];

        const repository = await this.repository();
        let result = await repository.find();
        await Promise.all(result.map(async (res) => {
            smartFiles.push(new SmartFile(res));
        }));

        return smartFiles;
    }

    public async findById(id: string): Promise<SmartFile | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);
        return new SmartFile(result);
    }

    public async create(dto: SmartFileDto): Promise<SmartFile> {
        const repository = await this.repository();
        let result = await repository.create(dto);

        return new SmartFile(result);
    }

    public async update(
        id: string,
        newValue: SmartFileDto,
    ): Promise<SmartFile | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("SmartFile doesn't exist");
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
