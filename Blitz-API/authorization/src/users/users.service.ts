import { Injectable } from '@nestjs/common';
import { User, UserEntity, UserCollection } from './entities/user.entity';
import { getConnection, createConnection, Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';

import { ConfigurationsService } from 'src/configurations/configurations.service';
import { CredentialType } from 'src/enums/credential.type';

import { StatusType } from 'src/enums/status.type';

@Injectable()
export class UsersService {
    constructor(
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<UserConfig> {
        const config = await this.configurationsService.get('authorization');
        const conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new UserFireorm(conn);
        } else {
            return new UserTypeorm(conn);
        }
    }

    public async findAll(query: any): Promise<User[]> {
        const repository = await this.connection();
        return await repository.findAll(query);
    }

    public async findById(id: string): Promise<User | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async create(dto: UserDto): Promise<User> {
        const repository = await this.connection();
        dto.status = StatusType.ACTIVE;
        return await repository.create(dto);
    }

    public async login(username: string, password: string): Promise<User> {
        const repository = await this.connection();
        return await repository.login(username, password);
    }

    public async update(id: string, newValue: any): Promise<User | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface UserConfig {
    findAll(query: any): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    create(dto: UserDto): Promise<User>;
    login(username: string, password: string): Promise<User>;
    update(id: string, newValue: any): Promise<User | null>;
    delete(id: string);
}

class UserTypeorm implements UserConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<Repository<UserEntity>> {
        try {
            const db = getConnection(this.connection['name']);
            return db.getRepository(UserEntity);
        } catch (e) {
            const db = await createConnection(this.connection);
            return db.getRepository(UserEntity);
        }
    }

    public async findAll(query: any): Promise<User[]> {
        const repository = await this.repository();
        let selectQueryBuilder = repository.createQueryBuilder('users');

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
        );

        queries.map((q) => {
            selectQueryBuilder = selectQueryBuilder.where(`${q.type} = :value`, { value: q.value });
        })

        return await selectQueryBuilder.limit(limit).getMany();
    }

    public async findById(id: string): Promise<User | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    private async save(dto: UserDto): Promise<User> {
        const repository = await this.repository();
        return await repository.save(dto);
    }

    public async create(dto: UserDto): Promise<User> {
        dto.password = bcrypt.hashSync(dto.password, 10);
        return await this.save(dto);
    }

    public async login(username: string, password: string): Promise<User> {
        const repository = await this.repository();
        const user = await repository.findOne({ "username": username });
        if (user && bcrypt.compareSync(password, user.password)) {
            return user;
        }
        return null;
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<User | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("User doesn't exist");
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

class UserFireorm implements UserConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<fireorm.BaseFirestoreRepository<UserCollection> | null> {
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

        return fireorm.getRepository(UserCollection);
    }

    public async findAll(): Promise<User[]> {
        let users = [];

        const repository = await this.repository();
        let result = await repository.find();
        result.map((res) => {
            users.push(new User(res));
        });

        return users;
    }

    public async findById(id: string): Promise<User | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);

        return new User(result);
    }

    private async save(dto: UserDto): Promise<User> {
        const repository = await this.repository();
        let result = await repository.create(dto);

        return new User(result);
    }

    public async create(dto: UserDto): Promise<User> {
        dto.password = bcrypt.hashSync(dto.password, 10);
        return await this.save(dto);
    }

    public async login(username: string, password: string): Promise<User> {
        const repository = await this.repository();
        const result = await repository.whereEqualTo('username', username).findOne();
        if (result && bcrypt.compareSync(password, result.password)) {
            return new User(result);
        }
        return null;
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<User | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("User doesn't exist");
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