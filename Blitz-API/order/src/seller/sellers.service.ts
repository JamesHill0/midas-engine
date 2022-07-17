import { Injectable } from '@nestjs/common';
import { Seller, SellerCollection, SellerEntity } from './entities/seller.entity';
import { getConnection, Repository } from 'typeorm';
import { SellerDto } from './dto/seller.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { createConnection } from 'net';
import { ConfigurationsService } from 'src/configurations/configurations.service';

@Injectable()
export class SellersService {
    constructor(
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<SellersConfig> {
        let config = await this.configurationsService.get('client');
        let conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new SellersFireorm(conn);
        } else {
            return new SellersTypeorm(conn);
        }
    }

    public async findAll(): Promise<Seller[]> {
        const repository = await this.connection();
        return repository.findAll();
    }

    public async findById(id: string): Promise<Seller | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async create(dto: SellerDto): Promise<Seller> {
        const repository = await this.connection();
        return await repository.create(dto);
    }

    public async update(
        id: string,
        newValue: SellerDto,
    ): Promise<Seller | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface SellersConfig {
    findAll(): Promise<Seller[]>;
    findById(id: string): Promise<Seller | null>;
    create(dto: SellerDto): Promise<Seller>;
    update(id: string, newValue: SellerDto): Promise<Seller | null>;
    delete(id: string);
}

class SellersTypeorm implements SellersConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<Repository<SellerEntity>> {
        createConnection(this.connection);
        await getConnection().query("CREATE DATABASE IF NOT EXISTS");
        await getConnection().synchronize(true);
        return getConnection().getRepository(SellerEntity);
    }

    public async findAll(): Promise<Seller[]> {
        const repository = await this.repository();
        return await repository.find();
    }

    public async findById(id: string): Promise<Seller | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    public async create(dto: SellerDto): Promise<Seller> {
        const repository = await this.repository();
        return await repository.save(dto);
    }

    public async update(
        id: string,
        newValue: SellerDto,
    ): Promise<Seller | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Seller doesn't exist");
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

class SellersFireorm implements SellersConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<fireorm.BaseFirestoreRepository<SellerCollection> | null> {
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

        return fireorm.getRepository(SellerCollection);
    }

    public async findAll(): Promise<Seller[]> {
        let Sellers = [];

        const repository = await this.repository();
        let result = await repository.find();
        result.map((res) => {
            Sellers.push(new Seller(res));
        })

        return Sellers;
    }

    public async findById(id: string): Promise<Seller | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);

        return new Seller(result);
    }

    public async create(dto: SellerDto): Promise<Seller> {
        const repository = await this.repository();
        let result = await repository.create(dto);

        return new Seller(result);
    }

    public async update(
        id: string,
        newValue: SellerDto,
    ): Promise<Seller | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Seller doesn't exist");
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