import { Injectable } from '@nestjs/common';
import { getConnection, createConnection, Repository } from 'typeorm';
import { DataMapping, DataMappingCollection, DataMappingEntity } from './entities/data.mapping.entity';
import { DataMappingDto } from './dto/data.mapping.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { ConfigurationsService } from 'src/configurations/configurations.service';

@Injectable()
export class DataMappingsService {
  constructor(
    private readonly configurationsService: ConfigurationsService
  ) { }

  private async connection(): Promise<DataMappingsConfig> {
    let config = await this.configurationsService.get('mapping');
    let conn = JSON.parse(config);
    if (conn.type == CredentialType.FIRE) {
      return new DataMappingsFireorm(conn);
    } else {
      return new DataMappingsTypeorm(conn);
    }
  }

  public async findAll(query: any): Promise<DataMapping[]> {
    const repository = await this.connection();
    return repository.findAll(query);
  }

  public async findById(id: string): Promise<DataMapping | null> {
    const repository = await this.connection();
    return await repository.findById(id);
  }

  public async create(dto: DataMappingDto): Promise<DataMapping> {
    const repository = await this.connection();
    return await repository.create(dto);
  }

  public async update(
    id: string,
    newValue: any
  ): Promise<DataMapping | null> {
    const repository = await this.connection();
    return await repository.update(id, newValue);
  }

  public async delete(id: string) {
    const repository = await this.connection();
    await repository.delete(id);
  }
}

interface DataMappingsConfig {
  findAll(query: any): Promise<DataMapping[]>;
  findById(id: string): Promise<DataMapping | null>;
  create(dto: DataMappingDto): Promise<DataMapping>;
  update(id: string, newValue: any): Promise<DataMapping | null>;
  delete(id: string);
}

class DataMappingsTypeorm implements DataMappingsConfig {
  constructor(
    private connection: any
  ) { }

  private async repository(): Promise<Repository<DataMappingEntity>> {
    try {
      const db = getConnection(this.connection['name']);
      return db.getRepository(DataMappingEntity);
    } catch (e) {
      const db = await createConnection(this.connection);
      return db.getRepository(DataMappingEntity);
    }
  }

  public async findAll(query: any): Promise<DataMapping[]> {
    const repository = await this.repository();
    const queryBuilderName = 'data-mappings';
    let selectQueryBuilder = repository.createQueryBuilder(queryBuilderName);

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
      selectQueryBuilder = selectQueryBuilder.where(`${queryBuilderName}.${q.type} = :value`, { value: q.value });
    })

    if (limit == 0) {
      return await selectQueryBuilder.getMany();
    }
    return await selectQueryBuilder.limit(limit).getMany();
  }

  public async findById(id: string): Promise<DataMapping | null> {
    const repository = await this.repository();
    return await repository.findOneOrFail(id);
  }

  public async create(dto: DataMappingDto): Promise<DataMapping> {
    const repository = await this.repository();
    return await repository.save(dto);
  }

  public async update(
    id: string,
    newValue: any,
  ): Promise<DataMapping | null> {
    const data = await this.findById(id);
    if (!data.id) {
      // tslint:disable-next-line:no-console
      console.error("Data Mapping doesn't exist")
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

class DataMappingsFireorm implements DataMappingsConfig {
  constructor(
    private connection: any
  ) { }

  private async repository(): Promise<fireorm.BaseFirestoreRepository<DataMappingCollection> | null> {
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

    return fireorm.getRepository(DataMappingCollection);
  }

  public async findAll(): Promise<DataMapping[]> {
    let dataMappings = [];

    const repository = await this.repository();
    let result = await repository.find();
    await Promise.all(result.map(async (res) => {
      dataMappings.push(new DataMapping(res));
    }));

    return dataMappings;
  }

  public async findById(id: string): Promise<DataMapping | null> {
    const repository = await this.repository();
    let result = await repository.findById(id);

    return new DataMapping(result);
  }

  public async create(dto: DataMappingDto): Promise<DataMapping> {
    const repository = await this.repository();

    let result = await repository.create(dto);
    return new DataMapping(result);
  }

  public async update(
    id: string,
    newValue: any
  ): Promise<DataMapping | null> {
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
