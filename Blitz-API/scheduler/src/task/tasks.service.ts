import { Injectable } from '@nestjs/common';
import { Task, TaskCollection, TaskEntity } from './entities/task.entity';
import { getConnection, createConnection, Repository } from 'typeorm';
import { TaskDto } from './dto/task.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { ConfigurationsService } from 'src/configurations/configurations.service';

@Injectable()
export class TasksService {
    constructor(
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<TasksConfig> {
        let config = await this.configurationsService.get('scheduler');
        let conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new TasksFireorm(conn);
        }
        return new TasksTypeorm(conn);
    }

    public async findAll(query: any): Promise<Task[]> {
        const repository = await this.connection();
        return repository.findAll(query);
    }

    public async findById(id: string): Promise<Task | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async create(dto: TaskDto): Promise<Task> {
        const repository = await this.connection();
        return await repository.create(dto);
    }

    public async update(
        id: string,
        newValue: any,
    ): Promise<Task | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface TasksConfig {
    findAll(query: any): Promise<Task[]>;
    findById(id: string): Promise<Task | null>;
    create(dto: TaskDto): Promise<Task>;
    update(id: string, newValue: any): Promise<Task | null>;
    delete(id: string);
}

class TasksTypeorm implements TasksConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<Repository<TaskEntity>> {
        try {
            const db = getConnection(this.connection['name']);
            return db.getRepository(TaskEntity);
        } catch (e) {
            const db = await createConnection(this.connection);
            return db.getRepository(TaskEntity);
        }
    }

    public async findAll(query: any): Promise<Task[]> {
        const repository = await this.repository();
        let selectQueryBuilder = repository.createQueryBuilder('tasks');

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

    public async findById(id: string): Promise<Task | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    public async create(dto: TaskDto): Promise<Task> {
        const repository = await this.repository();
        return await repository.save(dto);
    }

    public async update(id: string, newValue: any): Promise<Task | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Task doesn't exist");
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

class TasksFireorm implements TasksConfig {
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

    private async repository(): Promise<fireorm.BaseFirestoreRepository<TaskCollection> | null> {
        await this.initialize();
        return fireorm.getRepository(TaskCollection);
    }

    public async findAll(): Promise<Task[]> {
        let tasks = [];

        const repository = await this.repository();
        let result = await repository.find();
        result.map((res) => {
            tasks.push(new Task(res));
        })

        return tasks;
    }

    public async findById(id: string): Promise<Task | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);

        return new Task(result);
    }

    public async create(dto: TaskDto): Promise<Task> {
        const repository = await this.repository();
        let result = await repository.create(dto);

        return new Task(result);
    }

    public async update(id: string, newValue: any): Promise<Task | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Task doesn't exist");
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