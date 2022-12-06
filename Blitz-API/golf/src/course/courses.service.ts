import { Injectable } from '@nestjs/common';
import { Course, CourseCollection, CourseEntity } from './entities/course.entity';
import { getConnection, Repository } from 'typeorm';
import { CourseDto } from './dto/course.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { createConnection } from 'net';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { Hole, HoleCollection } from 'src/hole/entities/hole.entity';
import { HolesService } from 'src/hole/holes.service';

@Injectable()
export class CoursesService {
    constructor(
        private readonly holesService: HolesService,
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<CoursesConfig> {
        let config = await this.configurationsService.get('client');
        let conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new CoursesFireorm(conn, this.holesService);
        } else {
            return new CoursesTypeorm(conn);
        }
    }

    public async findAll(): Promise<Course[]> {
        const repository = await this.connection();
        return repository.findAll();
    }

    public async findById(id: string): Promise<Course | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async create(dto: CourseDto): Promise<Course> {
        const repository = await this.connection();
        return await repository.create(dto);
    }

    public async update(
        id: string,
        newValue: CourseDto,
    ): Promise<Course | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface CoursesConfig {
    findAll(): Promise<Course[]>;
    findById(id: string): Promise<Course | null>;
    create(dto: CourseDto): Promise<Course>;
    update(id: string, newValue: CourseDto): Promise<Course | null>;
    delete(id: string);
}

class CoursesTypeorm implements CoursesConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<Repository<CourseEntity>> {
        createConnection(this.connection);
        await getConnection().query("CREATE DATABASE IF NOT EXISTS");
        await getConnection().synchronize(true);
        return getConnection().getRepository(CourseEntity);
    }

    public async findAll(): Promise<Course[]> {
        const repository = await this.repository();
        return await repository.find();
    }

    public async findById(id: string): Promise<Course | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    public async create(dto: CourseDto): Promise<Course> {
        const repository = await this.repository();
        return await repository.save(dto);
    }

    public async update(
        id: string,
        newValue: CourseDto,
    ): Promise<Course | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Course doesn't exist");
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

class CoursesFireorm implements CoursesConfig {
    constructor(
        private connection: any,
        private holesService: HolesService
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

    private async repository(): Promise<fireorm.BaseFirestoreRepository<CourseCollection> | null> {
        await this.initialize();
        return fireorm.getRepository(CourseCollection);
    }

    public async findAll(): Promise<Course[]> {
        let courses = [];

        const repository = await this.repository();
        let result = await repository.find();
        await Promise.all(result.map(async (res) => {
            res.holes = await this.holesService.findByCourseId(res.id);
            courses.push(new Course(res));
        }));

        return courses;
    }

    public async findById(id: string): Promise<Course | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);

        result.holes = await this.holesService.findByCourseId(result.id);

        return new Course(result);
    }

    public async create(dto: CourseDto): Promise<Course> {
        const repository = await this.repository();
        let result = await repository.create(dto);

        return new Course(result);
    }

    public async update(
        id: string,
        newValue: CourseDto,
    ): Promise<Course | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Course doesn't exist");
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