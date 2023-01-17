import { Injectable } from '@nestjs/common';
import { Workflow, WorkflowCollection, WorkflowEntity } from './entities/workflow.entity';
import { getConnection, createConnection, Repository } from 'typeorm';
import { WorkflowDto } from './dto/workflow.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { ConfigurationsService } from 'src/configurations/configurations.service';

@Injectable()
export class WorkflowsService {
  constructor(
    private readonly configurationsService: ConfigurationsService
  ) { }

  private async connection(): Promise<WorkflowsConfig> {
    let config = await this.configurationsService.get('mapping');
    let conn = JSON.parse(config);
    if (conn.type == CredentialType.FIRE) {
      return new WorkflowsFireorm(conn);
    } else {
      return new WorkflowsTypeorm(conn);
    }
  }

  public async findAll(query: any): Promise<Workflow[]> {
    const repository = await this.connection();
    return repository.findAll(query);
  }

  public async findById(id: string): Promise<Workflow | null> {
    const repository = await this.connection();
    return await repository.findById(id);
  }

  public async create(dto: WorkflowDto): Promise<Workflow> {
    const repository = await this.connection();
    return await repository.create(dto);
  }

  public async update(
    id: string,
    newValue: any,
  ): Promise<Workflow | null> {
    const repository = await this.connection();
    return await repository.update(id, newValue);
  }

  public async delete(id: string) {
    const repository = await this.connection();
    await repository.delete(id);
  }
}

interface WorkflowsConfig {
  findAll(query: any): Promise<Workflow[]>;
  findById(id: string): Promise<Workflow | null>;
  create(dto: WorkflowDto): Promise<Workflow>;
  update(id: string, newValue: any): Promise<Workflow | null>;
  delete(id: string);
}

class WorkflowsTypeorm implements WorkflowsConfig {
  constructor(
    private connection: any
  ) { }

  private async repository(): Promise<Repository<WorkflowEntity>> {
    try {
      const db = getConnection(this.connection['name']);
      return db.getRepository(WorkflowEntity);
    } catch (e) {
      const db = await createConnection(this.connection);
      return db.getRepository(WorkflowEntity);
    }
  }

  public async findAll(query: any): Promise<Workflow[]> {
    const repository = await this.repository();
    const queryBuilderName = 'workflows'
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

  public async findById(id: string): Promise<Workflow | null> {
    const repository = await this.repository();
    return await repository.findOneOrFail(id);
  }

  public async create(dto: WorkflowDto): Promise<Workflow> {
    const repository = await this.repository();
    return await repository.save(dto);
  }

  public async update(
    id: string,
    newValue: any,
  ): Promise<Workflow | null> {
    const data = await this.findById(id);
    if (!data.id) {
      // tslint:disable-next-line:no-console
      console.error("Workflow doesn't exist");
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

class WorkflowsFireorm implements WorkflowsConfig {
  constructor(
    private connection: any
  ) { }

  private async repository(): Promise<fireorm.BaseFirestoreRepository<WorkflowCollection> | null> {
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

    return fireorm.getRepository(WorkflowCollection);
  }

  public async findAll(): Promise<Workflow[]> {
    let workflows = [];

    const repository = await this.repository();
    let result = await repository.find();
    await Promise.all(result.map(async (res) => {
      workflows.push(new Workflow(res));
    }));

    return workflows;
  }

  public async findById(id: string): Promise<Workflow | null> {
    const repository = await this.repository();
    let result = await repository.findById(id);

    return new Workflow(result);
  }

  public async create(dto: WorkflowDto): Promise<Workflow> {
    const repository = await this.repository();
    let result = await repository.create(dto);

    return new Workflow(result);
  }

  public async update(
    id: string,
    newValue: any,
  ): Promise<Workflow | null> {
    const data = await this.findById(id);
    if (!data.id) {
      // tslint:disable-next-line:no-console
      console.error("Workflow doesn't exist");
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
