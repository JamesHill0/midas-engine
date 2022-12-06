import { Injectable } from '@nestjs/common';
import { Database, DatabaseCollection, DatabaseEntity} from './entities/database.entity';
import { getConnection, createConnection, Repository } from 'typeorm';
import { DatabaseDto } from './dto/database.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { ConfigurationsService } from 'src/configurations/configurations.service';

@Injectable()
export class DatabasesService {
  constructor(
      private readonly configurationsService: ConfigurationsService
  ) { }

  private async connection(): Promise<DatabasesConfig> {
      let config = await this.configurationsService.get('integration');
      let conn = JSON.parse(config);
      if (conn.type == CredentialType.FIRE) {
          return new DatabasesFireorm(conn);
      } else {
          return new DatabasesTypeorm(conn);
      }
  }

  public async findAll(): Promise<Database[]> {
      const repository = await this.connection();
      return repository.findAll();
  }

  public async findById(id: string): Promise<Database | null> {
      const repository = await this.connection();
      return await repository.findById(id);
  }

  public async create(dto: DatabaseDto): Promise<Database> {
      const repository = await this.connection();
      return await repository.create(dto);
  }

  public async update(
      id: string,
      newValue: DatabaseDto,
  ): Promise<Database | null> {
      const repository = await this.connection();
      return await repository.update(id, newValue);
  }

  public async delete(id: string) {
      const repository = await this.connection();
      await repository.delete(id);
  }
}

interface DatabasesConfig {
  findAll(): Promise<Database[]>;
  findById(id: string): Promise<Database | null>;
  create(dto: DatabaseDto): Promise<Database>;
  update(id: string, newValue: DatabaseDto): Promise<Database | null>;
  delete(id: string);
}

class DatabasesTypeorm implements DatabasesConfig {
  constructor(
      private connection: any
  ) { }

  private async repository(): Promise<Repository<DatabaseEntity>> {
      try {
          const db = getConnection(this.connection['name']);
          return db.getRepository(DatabaseEntity);
      } catch (e) {
          const db = await createConnection(this.connection);
          return db.getRepository(DatabaseEntity);
      }
  }

  public async findAll(): Promise<Database[]> {
      const repository = await this.repository();
      return await repository.find();
  }

  public async findById(id: string): Promise<Database | null> {
      const repository = await this.repository();
      return await repository.findOneOrFail(id);
  }

  public async create(dto: DatabaseDto): Promise<Database> {
      const repository = await this.repository();
      return await repository.save(dto);
  }

  public async update(
      id: string,
      newValue: DatabaseDto,
  ): Promise<Database | null> {
      const data = await this.findById(id);
      if (!data.id) {
          // tslint:disable-next-line:no-console
          console.error("Database doesn't exist");
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

class DatabasesFireorm implements DatabasesConfig {
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

  private async repository(): Promise<fireorm.BaseFirestoreRepository<DatabaseCollection> | null> {
      await this.initialize();
      return fireorm.getRepository(DatabaseCollection);
  }

  public async findAll(): Promise<Database[]> {
      let Databases = [];

      const repository = await this.repository();
      let result = await repository.find();
      await Promise.all(result.map(async (res) => {
          Databases.push(new Database(res));
      }));

      return Databases;
  }

  public async findById(id: string): Promise<Database | null> {
      const repository = await this.repository();
      let result = await repository.findById(id);
      return new Database(result);
  }

  public async create(dto: DatabaseDto): Promise<Database> {
      const repository = await this.repository();
      let result = await repository.create(dto);

      return new Database(result);
  }

  public async update(
      id: string,
      newValue: DatabaseDto,
  ): Promise<Database | null> {
      const data = await this.findById(id);
      if (!data.id) {
          // tslint:disable-next-line:no-console
          console.error("Database doesn't exist");
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
