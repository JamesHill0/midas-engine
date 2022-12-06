import { Injectable } from '@nestjs/common';
import { Order, OrderCollection, OrderEntity } from './entities/order.entity';
import { getConnection, Repository } from 'typeorm';
import { OrderDto } from './dto/order.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { createConnection } from 'net';
import { ConfigurationsService } from 'src/configurations/configurations.service';

@Injectable()
export class OrdersService {
    constructor(
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<OrdersConfig> {
        let config = await this.configurationsService.get('client');
        let conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new OrdersFireorm(conn);
        } else {
            return new OrdersTypeorm(conn);
        }
    }

    public async findAll(): Promise<Order[]> {
        const repository = await this.connection();
        return repository.findAll();
    }

    public async findById(id: string): Promise<Order | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async create(dto: OrderDto): Promise<Order> {
        const repository = await this.connection();
        return await repository.create(dto);
    }

    public async update(
        id: string,
        newValue: OrderDto,
    ): Promise<Order | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface OrdersConfig {
    findAll(): Promise<Order[]>;
    findById(id: string): Promise<Order | null>;
    create(dto: OrderDto): Promise<Order>;
    update(id: string, newValue: OrderDto): Promise<Order | null>;
    delete(id: string);
}

class OrdersTypeorm implements OrdersConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<Repository<OrderEntity>> {
        createConnection(this.connection);
        await getConnection().query("CREATE DATABASE IF NOT EXISTS");
        await getConnection().synchronize(true);
        return getConnection().getRepository(OrderEntity);
    }

    public async findAll(): Promise<Order[]> {
        const repository = await this.repository();
        return await repository.find();
    }

    public async findById(id: string): Promise<Order | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    public async create(dto: OrderDto): Promise<Order> {
        const repository = await this.repository();
        return await repository.save(dto);
    }

    public async update(
        id: string,
        newValue: OrderDto,
    ): Promise<Order | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Order doesn't exist");
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

class OrdersFireorm implements OrdersConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<fireorm.BaseFirestoreRepository<OrderCollection> | null> {
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

        return fireorm.getRepository(OrderCollection);
    }

    public async findAll(): Promise<Order[]> {
        let Orders = [];

        const repository = await this.repository();
        let result = await repository.find();
        result.map((res) => {
            Orders.push(new Order(res));
        })

        return Orders;
    }

    public async findById(id: string): Promise<Order | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);

        return new Order(result);
    }

    public async create(dto: OrderDto): Promise<Order> {
        const repository = await this.repository();
        let result = await repository.create(dto);

        return new Order(result);
    }

    public async update(
        id: string,
        newValue: OrderDto,
    ): Promise<Order | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Order doesn't exist");
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