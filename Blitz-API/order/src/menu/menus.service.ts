import { Injectable } from '@nestjs/common';
import { Menu, MenuCollection, MenuEntity } from './entities/menu.entity';
import { getConnection, Repository } from 'typeorm';
import { MenuDto } from './dto/menu.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { createConnection } from 'net';
import { ConfigurationsService } from 'src/configurations/configurations.service';

@Injectable()
export class MenusService {
    constructor(
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<MenusConfig> {
        let config = await this.configurationsService.get('client');
        let conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new MenusFireorm(conn);
        } else {
            return new MenusTypeorm(conn);
        }
    }

    public async findAll(): Promise<Menu[]> {
        const repository = await this.connection();
        return repository.findAll();
    }

    public async findById(id: string): Promise<Menu | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async create(dto: MenuDto): Promise<Menu> {
        const repository = await this.connection();
        return await repository.create(dto);
    }

    public async update(
        id: string,
        newValue: MenuDto,
    ): Promise<Menu | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface MenusConfig {
    findAll(): Promise<Menu[]>;
    findById(id: string): Promise<Menu | null>;
    create(dto: MenuDto): Promise<Menu>;
    update(id: string, newValue: MenuDto): Promise<Menu | null>;
    delete(id: string);
}

class MenusTypeorm implements MenusConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<Repository<MenuEntity>> {
        createConnection(this.connection);
        await getConnection().query("CREATE DATABASE IF NOT EXISTS");
        await getConnection().synchronize(true);
        return getConnection().getRepository(MenuEntity);
    }

    public async findAll(): Promise<Menu[]> {
        const repository = await this.repository();
        return await repository.find();
    }

    public async findById(id: string): Promise<Menu | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    public async create(dto: MenuDto): Promise<Menu> {
        const repository = await this.repository();
        return await repository.save(dto);
    }

    public async update(
        id: string,
        newValue: MenuDto,
    ): Promise<Menu | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Menu doesn't exist");
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

class MenusFireorm implements MenusConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<fireorm.BaseFirestoreRepository<MenuCollection> | null> {
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

        return fireorm.getRepository(MenuCollection);
    }

    public async findAll(): Promise<Menu[]> {
        let Menus = [];

        const repository = await this.repository();
        let result = await repository.find();
        result.map((res) => {
            Menus.push(new Menu(res));
        })

        return Menus;
    }

    public async findById(id: string): Promise<Menu | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);

        return new Menu(result);
    }

    public async create(dto: MenuDto): Promise<Menu> {
        const repository = await this.repository();
        let result = await repository.create(dto);

        return new Menu(result);
    }

    public async update(
        id: string,
        newValue: MenuDto,
    ): Promise<Menu | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Menu doesn't exist");
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