import { Injectable } from '@nestjs/common';
import { getConnection, createConnection, Repository } from 'typeorm';
import { DirectFieldMapping, DirectFieldMappingCollection, DirectFieldMappingEntity } from './entities/direct.field.mapping.entity';
import { DirectFieldMappingDto } from './dto/direct.field.mapping';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { ConfigurationsService } from 'src/configurations/configurations.service';

@Injectable()
export class DirectFieldMappingsService {
  constructor(
    private readonly configurationsService: ConfigurationsService
  ) { }

  private async connection(): Promise<DirectFieldMappingsConfig> {
    let config = await this.configurationsService.get('mapping');
    let conn = JSON.parse(config);
    if (conn.type == CredentialType.FIRE) {
      return new DirectFieldMappingsFireorm(conn);
    } else {
      return new DirectFieldMappingsTypeorm(conn);
    }
  }

  public async findAll(query: any): Promise<DirectFieldMapping[]> {
    const repository = await this.connection();
    return repository.findAll(query);
  }

  public async findById(id: string): Promise<DirectFieldMapping | null> {
    const repository = await this.connection();
    return await repository.findById(id);
  }

  public async create(dto: DirectFieldMappingDto): Promise<DirectFieldMapping> {
    const repository = await this.connection();
    return await repository.create(dto);
  }

  public async update(
    id: string,
    newValue: any,
  ): Promise<DirectFieldMapping | null> {
    const repository = await this.connection();
    return await repository.update(id, newValue);
  }

  public async delete(id: string) {
    const repository = await this.connection();
    await repository.delete(id);
  }
}

interface DirectFieldMappingsConfig {
  findAll(query: any): Promise<DirectFieldMapping[]>;
  findById(id: string): Promise<DirectFieldMapping | null>;
  create(dto: DirectFieldMappingDto): Promise<DirectFieldMapping>;
  update(id: string, newValue: any): Promise<DirectFieldMapping | null>;
  delete(id: string);
}

class DirectFieldMappingsTypeorm implements DirectFieldMappingsConfig {
  constructor(
    private connection: any
  ) { }

  private async repository(): Promise<Repository<DirectFieldMappingEntity>> {
    try {
      const db = getConnection(this.connection['name']);
      return db.getRepository(DirectFieldMappingEntity);
    } catch (e) {
      const db = await createConnection(this.connection);
      return db.getRepository(DirectFieldMappingEntity);
    }
  }

  public async findAll(query: any): Promise<DirectFieldMapping[]> {
    const repository = await this.repository();
    let selectQueryBuilder = repository.createQueryBuilder('direct-field-mappings');

    let limit = 0;
    if (query.limit) {
      if (isNaN(query.limit)) {
        limit = 0;
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

    if (limit == 0) {
      return await selectQueryBuilder.getMany();
    }
    return await selectQueryBuilder.limit(limit).getMany();
  }

  public async findById(id: string): Promise<DirectFieldMapping | null> {
    const repository = await this.repository();
    return await repository.findOneOrFail(id);
  }

  public async create(dto: DirectFieldMappingDto): Promise<DirectFieldMapping> {
    const repository = await this.repository();
    return await repository.save(dto);
  }

  public async update(
    id: string,
    newValue: any,
  ): Promise<DirectFieldMapping | null> {
    const data = await this.findById(id);
    if (!data.id) {
      // tslint:disable-next-line:no-console
      console.error("Direct Field Mapping doesn't exist")
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

class DirectFieldMappingsFireorm implements DirectFieldMappingsConfig {
  constructor(
    private connection: any
  ) { }

  private async repository(): Promise<fireorm.BaseFirestoreRepository<DirectFieldMappingCollection> | null> {
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

    return fireorm.getRepository(DirectFieldMappingCollection);
  }

  public async findAll(): Promise<DirectFieldMapping[]> {
    let directFieldMappings = [];

    const repository = await this.repository();
    let result = await repository.find();
    await Promise.all(result.map(async (res) => {
      directFieldMappings.push(new DirectFieldMapping(res));
    }));

    return directFieldMappings;
  }

  public async findById(id: string): Promise<DirectFieldMapping | null> {
    const repository = await this.repository();
    let result = await repository.findById(id);

    return new DirectFieldMapping(result);
  }

  public async create(dto: DirectFieldMappingDto): Promise<DirectFieldMapping> {
    const repository = await this.repository();

    let result = await repository.create(dto);
    return new DirectFieldMapping(result);
  }

  public async update(
    id: string,
    newValue: any
  ): Promise<DirectFieldMapping | null> {
    const data = await this.findById(id);
    if (!data.id) {
      // tslint:disable-next-line:no-console
      console.error("Direct Field Mapping doesn't exist");
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
