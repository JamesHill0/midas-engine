import { Injectable } from '@nestjs/common';
import { Hole, HoleCollection, HoleEntity } from './entities/hole.entity';
import { getConnection, Repository } from 'typeorm';
import { HoleDto } from './dto/hole.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { createConnection } from 'net';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { HoleImage, HoleImageCollection } from './entities/hole_image.entity';
import { HoleVideo, HoleVideoCollection } from './entities/hole_video.entity';
import { HoleLocation, HoleLocationCollection } from './entities/hole_location.entity';

@Injectable()
export class HolesService {
    constructor(
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<HolesConfig> {
        let config = await this.configurationsService.get('client');
        let conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new HolesFireorm(conn);
        } else {
            return new HolesTypeorm(conn);
        }
    }

    public async findAll(): Promise<Hole[]> {
        const repository = await this.connection();
        return repository.findAll();
    }

    public async findById(id: string): Promise<Hole | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async findByCourseId(id: string): Promise<Hole[]> {
        const repository = await this.connection();
        return await repository.findByCourseId(id);
    }

    public async create(dto: HoleDto): Promise<Hole> {
        const repository = await this.connection();
        return await repository.create(dto);
    }

    public async update(
        id: string,
        newValue: HoleDto,
    ): Promise<Hole | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface HolesConfig {
    findAll(): Promise<Hole[]>;
    findById(id: string): Promise<Hole | null>;
    findByCourseId(id: string): Promise<Hole[]>;
    create(dto: HoleDto): Promise<Hole>;
    update(id: string, newValue: HoleDto): Promise<Hole | null>;
    delete(id: string);
}

class HolesTypeorm implements HolesConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<Repository<HoleEntity>> {
        createConnection(this.connection);
        await getConnection().query("CREATE DATABASE IF NOT EXISTS");
        await getConnection().synchronize(true);
        return getConnection().getRepository(HoleEntity);
    }

    public async findAll(): Promise<Hole[]> {
        const repository = await this.repository();
        return await repository.find();
    }

    public async findById(id: string): Promise<Hole | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    public async findByCourseId(id: string): Promise<Hole[]> {
        const repository = await this.repository();
        return await repository.find({'courseId': id});
    }

    public async create(dto: HoleDto): Promise<Hole> {
        const repository = await this.repository();
        return await repository.save(dto);
    }

    public async update(
        id: string,
        newValue: HoleDto,
    ): Promise<Hole | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Hole doesn't exist");
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

class HolesFireorm implements HolesConfig {
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

    private async repository(): Promise<fireorm.BaseFirestoreRepository<HoleCollection> | null> {
        await this.initialize();
        return fireorm.getRepository(HoleCollection);
    }

    private async findHoleImagesByHoleId(id: string): Promise<HoleImage[]> {
        let images = [];

        await this.initialize();
        let repository = fireorm.getRepository(HoleImageCollection);
        let result = await repository.whereEqualTo('holeId', id).find();
        result.map((res) => {
            images.push(new HoleImage(res));
        });

        return images;
    }

    private async findHoleVideosByHoleId(id: string): Promise<HoleVideo[]> {
        let videos = [];

        await this.initialize();
        let repository = fireorm.getRepository(HoleVideoCollection);
        let result = await repository.whereEqualTo('holeId', id).find();
        result.map((res) => {
            videos.push(new HoleVideo(res));
        });

        return videos;
    }

    private async findHoleLocationsByHoleId(id: string): Promise<HoleLocation[]> {
        let locations = [];

        await this.initialize();
        let repository = fireorm.getRepository(HoleLocationCollection);
        let result = await repository.whereEqualTo('holeId', id).find();
        result.map((res) => {
            locations.push(new HoleLocation(res));
        });

        return locations;
    }

    public async findAll(): Promise<Hole[]> {
        let holes = [];

        const repository = await this.repository();
        let result = await repository.find();
        await Promise.all(result.map(async (res) => {
            res.images = await this.findHoleImagesByHoleId(res.id);
            res.videos = await this.findHoleVideosByHoleId(res.id);
            res.locations = await this.findHoleLocationsByHoleId(res.id);
            holes.push(new Hole(res));
        }));

        return holes;
    }

    public async findById(id: string): Promise<Hole | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);

        result.images = await this.findHoleImagesByHoleId(result.id);
        result.videos = await this.findHoleVideosByHoleId(result.id);
        result.locations = await this.findHoleLocationsByHoleId(result.id);

        return new Hole(result);
    }

    public async findByCourseId(id: string): Promise<Hole[]> {
        let holes = [];

        const repository = await this.repository();
        let result = await repository.whereEqualTo('courseId', id).find();
        await Promise.all(result.map(async (res) => {
            res.images = await this.findHoleImagesByHoleId(res.id);
            res.videos = await this.findHoleVideosByHoleId(res.id);
            res.locations = await this.findHoleLocationsByHoleId(res.id);
            holes.push(new Hole(res));
        }));

        return holes;
    }

    public async create(dto: HoleDto): Promise<Hole> {
        const repository = await this.repository();
        let result = await repository.create(dto);

        return new Hole(result);
    }

    public async update(
        id: string,
        newValue: HoleDto,
    ): Promise<Hole | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Hole doesn't exist");
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