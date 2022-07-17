import { Injectable } from '@nestjs/common';
import { Delivery, DeliveryCollection, DeliveryEntity } from './entities/delivery.entity';
import { getConnection, Repository } from 'typeorm';
import { DeliveryDto } from './dto/delivery.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { createConnection } from 'net';
import { ConfigurationsService } from 'src/configurations/configurations.service';

@Injectable()
export class DeliveriesService {
    constructor(
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<DeliveriesConfig> {
        let config = await this.configurationsService.get('client');
        let conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new DeliveriesFireorm(conn);
        } else {
            return new DeliveriesTypeorm(conn);
        }
    }

    public async findAll(): Promise<Delivery[]> {
        const repository = await this.connection();
        return repository.findAll();
    }

    public async findById(id: string): Promise<Delivery | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async create(dto: DeliveryDto): Promise<Delivery> {
        const repository = await this.connection();
        return await repository.create(dto);
    }

    public async update(
        id: string,
        newValue: DeliveryDto,
    ): Promise<Delivery | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface DeliveriesConfig {
    findAll(): Promise<Delivery[]>;
    findById(id: string): Promise<Delivery | null>;
    create(dto: DeliveryDto): Promise<Delivery>;
    update(id: string, newValue: DeliveryDto): Promise<Delivery | null>;
    delete(id: string);
}

class DeliveriesTypeorm implements DeliveriesConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<Repository<DeliveryEntity>> {
        createConnection(this.connection);
        await getConnection().query("CREATE DATABASE IF NOT EXISTS");
        await getConnection().synchronize(true);
        return getConnection().getRepository(DeliveryEntity);
    }

    public async findAll(): Promise<Delivery[]> {
        const repository = await this.repository();
        return await repository.find();
    }

    public async findById(id: string): Promise<Delivery | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    public async create(dto: DeliveryDto): Promise<Delivery> {
        const repository = await this.repository();
        return await repository.save(dto);
    }

    public async update(
        id: string,
        newValue: DeliveryDto,
    ): Promise<Delivery | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Delivery doesn't exist");
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

class DeliveriesFireorm implements DeliveriesConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<fireorm.BaseFirestoreRepository<DeliveryCollection> | null> {
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

        return fireorm.getRepository(DeliveryCollection);
    }

    public async findAll(): Promise<Delivery[]> {
        let Deliverys = [];

        const repository = await this.repository();
        let result = await repository.find();
        result.map((res) => {
            Deliverys.push(new Delivery(res));
        })

        return Deliverys;
    }

    public async findById(id: string): Promise<Delivery | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);

        return new Delivery(result);
    }

    public async create(dto: DeliveryDto): Promise<Delivery> {
        const repository = await this.repository();
        let result = await repository.create(dto);

        return new Delivery(result);
    }

    public async update(
        id: string,
        newValue: DeliveryDto,
    ): Promise<Delivery | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Delivery doesn't exist");
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