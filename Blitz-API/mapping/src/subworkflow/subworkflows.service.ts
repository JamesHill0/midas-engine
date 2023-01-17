import { Injectable } from '@nestjs/common';
import { Subworkflow, SubworkflowCollection, SubworkflowEntity } from './entities/subworkflow.entity';
import { getConnection, createConnection, Repository } from 'typeorm';
import { SubworkflowDto } from './dto/subworkflow.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { ConfigurationsService } from 'src/configurations/configurations.service';

@Injectable()
export class SubworkflowsService {
  constructor(
    private readonly configurationsService: ConfigurationsService
  ) { }

  private async connection(): Promise<SubworkflowsConfig> {
    let config = await this.configurationsService.get('mapping');
    let conn = JSON.parse(config);
    if (conn.type == CredentialType.FIRE) {
      return new SubworkflowsFireorm(conn);
    } else {
      return new SubworkflowsTypeorm(conn);
    }
  }

  public async findAll(query: any): Promise<Subworkflow[]> {
    const repository = await this.connection();
    return repository.findAll(query);
  }

  public async findById(id: string): Promise<Subworkflow | null> {
    const repository = await this.connection();
    return await repository.findById(id);
  }

  public async create(dto: SubworkflowDto): Promise<Subworkflow> {
    const repository = await this.connection();
    return await repository.create(dto);
  }

  public async update(
    id: string,
    newValue: SubworkflowDto,
  ): Promise<Subworkflow | null> {
    const repository = await this.connection();
    return await repository.update(id, newValue);
  }

  public async delete(id: string) {
    const repository = await this.connection();
    await repository.delete(id);
  }
}

interface SubworkflowsConfig {
  findAll(query: any): Promise<Subworkflow[]>;
  findById(id: string): Promise<Subworkflow | null>;
  create(dto: SubworkflowDto): Promise<Subworkflow>;
  update(id: string, newValue: SubworkflowDto): Promise<Subworkflow | null>;
  delete(id: string);
}

class SubworkflowsTypeorm implements SubworkflowsConfig {
  constructor(
    private connection: any
  ) { }

  private async repository(): Promise<Repository<SubworkflowEntity>> {
    try {
      const db = getConnection(this.connection['name']);
      return db.getRepository(SubworkflowEntity);
    } catch (e) {
      const db = await createConnection(this.connection);
      return db.getRepository(SubworkflowEntity);
    }
  }

  public async findAll(query: any): Promise<Subworkflow[]> {
    const repository = await this.repository();
    const queryBuilderName = 'subworkflows';
    let selectQueryBuilder = repository.createQueryBuilder(queryBuilderName);

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
      selectQueryBuilder = selectQueryBuilder.where(`${queryBuilderName}.${q.type} = :value`, { value: q.value });
    })

    return await selectQueryBuilder.limit(limit).getMany();
  }

  public async findById(id: string): Promise<Subworkflow | null> {
    const repository = await this.repository();
    return await repository.findOneOrFail(id);
  }

  public async create(dto: SubworkflowDto): Promise<Subworkflow> {
    const repository = await this.repository();
    return await repository.save(dto);
  }

  public async update(
    id: string,
    newValue: SubworkflowDto,
  ): Promise<Subworkflow | null> {
    const data = await this.findById(id);
    if (!data.id) {
      // tslint:disable-next-line:no-console
      console.error("Subworkflow doesn't exist");
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

class SubworkflowsFireorm implements SubworkflowsConfig {
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

  private async repository(): Promise<fireorm.BaseFirestoreRepository<SubworkflowCollection> | null> {
    await this.initialize();
    return fireorm.getRepository(SubworkflowCollection);
  }

  public async findAll(): Promise<Subworkflow[]> {
    let subworkflows = [];

    const repository = await this.repository();
    let result = await repository.find();
    await Promise.all(result.map(async (res) => {
      subworkflows.push(new Subworkflow(res));
    }));

    return subworkflows;
  }

  public async findById(id: string): Promise<Subworkflow | null> {
    const repository = await this.repository();
    let result = await repository.findById(id);
    return new Subworkflow(result);
  }

  public async create(dto: SubworkflowDto): Promise<Subworkflow> {
    const repository = await this.repository();
    let result = await repository.create(dto);

    return new Subworkflow(result);
  }

  public async update(
    id: string,
    newValue: SubworkflowDto,
  ): Promise<Subworkflow | null> {
    const data = await this.findById(id);
    if (!data.id) {
      // tslint:disable-next-line:no-console
      console.error("Subworkflow doesn't exist");
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
