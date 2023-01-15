import { Injectable } from '@nestjs/common';
import { WbEtl, WbEtlCollection, WbEtlEntity } from './entities/wbetl.entity';
import { getConnection, createConnection, Repository } from 'typeorm';
import { WbEtlDto } from './dto/wbetl.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { ConfigurationsService } from 'src/configurations/configurations.service';

@Injectable()
export class WbEtlsService {
  constructor(
    private readonly configurationsService: ConfigurationsService
  ) { }

  private async connection(): Promise<WbEtlsConfig> {
    let config = await this.configurationsService.get('external');
    let conn = JSON.parse(config);
    if (conn.type == CredentialType.FIRE) {
      return new WbEtlsFireorm(conn);
    } else {
      return new WbEtlsTypeorm(conn);
    }
  }

  public async findAll(): Promise<WbEtl[]> {
    const repository = await this.connection();
    return repository.findAll();
  }

  public async findById(id: string): Promise<WbEtl | null> {
    const repository = await this.connection();
    return await repository.findById(id);
  }

  public async create(dto: WbEtlDto): Promise<WbEtl> {
    const repository = await this.connection();
    const timestamp = Math.floor(Date.now() / 1000);

    if (dto.uniqueId == '') {
      dto.uniqueId = `${dto.externalId}-${timestamp}`;
    } else {
      dto.uniqueId = `${dto.externalId}-${dto.uniqueId}`;
    }

    return await repository.create(dto);
  }

  public async update(
    id: string,
    newValue: WbEtlDto,
  ): Promise<WbEtl | null> {
    const repository = await this.connection();
    return await repository.update(id, newValue);
  }

  public async delete(id: string) {
    const repository = await this.connection();
    await repository.delete(id);
  }
}

interface WbEtlsConfig {
  findAll(): Promise<WbEtl[]>;
  findById(id: string): Promise<WbEtl | null>;
  create(dto: WbEtlDto): Promise<WbEtl>;
  update(id: string, newValue: WbEtlDto): Promise<WbEtl | null>;
  delete(id: string);
}

class WbEtlsTypeorm implements WbEtlsConfig {
  constructor(
    private connection: any
  ) { }

  private async repository(): Promise<Repository<WbEtlEntity>> {
    try {
      const db = getConnection(this.connection['name']);
      return db.getRepository(WbEtlEntity);
    } catch (e) {
      const db = await createConnection(this.connection);
      return db.getRepository(WbEtlEntity);
    }
  }

  public async findAll(): Promise<WbEtl[]> {
    const repository = await this.repository();
    return await repository.find();
  }

  public async findById(id: string): Promise<WbEtl | null> {
    const repository = await this.repository();
    return await repository.findOneOrFail(id);
  }

  public async create(dto: WbEtlDto): Promise<WbEtl> {
    const repository = await this.repository();
    return await repository.save(dto);
  }

  public async update(
    id: string,
    newValue: WbEtlDto,
  ): Promise<WbEtl | null> {
    const data = await this.findById(id);
    if (!data.id) {
      // tslint:disable-next-line:no-console
      console.error("WbEtl doesn't exist");
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

class WbEtlsFireorm implements WbEtlsConfig {
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

  private async repository(): Promise<fireorm.BaseFirestoreRepository<WbEtlCollection> | null> {
    await this.initialize();
    return fireorm.getRepository(WbEtlCollection);
  }

  public async findAll(): Promise<WbEtl[]> {
    let WbEtls = [];

    const repository = await this.repository();
    let result = await repository.find();
    await Promise.all(result.map(async (res) => {
      WbEtls.push(new WbEtl(res));
    }));

    return WbEtls;
  }

  public async findById(id: string): Promise<WbEtl | null> {
    const repository = await this.repository();
    let result = await repository.findById(id);
    return new WbEtl(result);
  }

  public async create(dto: WbEtlDto): Promise<WbEtl> {
    const repository = await this.repository();
    let result = await repository.create(dto);

    return new WbEtl(result);
  }

  public async update(
    id: string,
    newValue: WbEtlDto,
  ): Promise<WbEtl | null> {
    const data = await this.findById(id);
    if (!data.id) {
      // tslint:disable-next-line:no-console
      console.error("WbEtl doesn't exist");
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
