import { Injectable, Logger } from '@nestjs/common';
import { Buyer } from './entities/buyer.entity';
import { DeleteResult, getConnection } from 'typeorm';
import { BuyerDto } from './dto/buyer.dto';

import { ConfigService } from 'nestjs-config';
import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { createConnection } from 'net';

@Injectable()
export class BuyersService {
    private async repository(): Promise<any> {
        let config = ConfigService.get('client');
        if (config.type == CredentialType.FIRE) {
            admin.initializeApp({
                credential: admin.credential.cert(config.secret),
                databaseURL: `https://${config.secret.project_id}.firebaseio.com`
            });

            const firestore = admin.firestore();
            firestore.settings({
                timestampsInSnapshots: true
            });

            fireorm.initialize(firestore);
            return fireorm.getRepository(Buyer);
        } else {
            createConnection(config);
            await getConnection().query('CREATE DATABASE IF NOT EXISTS');
            await getConnection().synchronize(true);
            return getConnection().getRepository(Buyer);
        }
    }

    public async findAll(): Promise<Buyer[]> {
        const repository = await this.repository();
        return repository.find();
    }

    public async findById(id: string): Promise<Buyer | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    public async create(dto: BuyerDto): Promise<Buyer> {
        const repository = await this.repository();
        return await repository.save(dto);
    }

    public async update(
        id: string,
        newValue: BuyerDto,
    ): Promise<Buyer | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            Logger.error("Buyer doesn't exist");
        }
        const repository = await this.repository();
        await repository.update(id, newValue);
        return await this.findById(id);
    }

    public async delete(id: string): Promise<DeleteResult> {
        const repository = await this.repository();
        return await repository.delete(id);
    }
}