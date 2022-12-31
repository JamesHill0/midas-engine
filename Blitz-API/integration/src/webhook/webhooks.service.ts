import { Injectable } from '@nestjs/common';
import { Webhook, WebhookCollection, WebhookEntity} from './entities/webhook.entity';
import { getConnection, createConnection, Repository } from 'typeorm';
import { WebhookDto } from './dto/webhook.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { ConfigurationsService } from 'src/configurations/configurations.service';

@Injectable()
export class WebhooksService {
  constructor(
      private readonly configurationsService: ConfigurationsService
  ) { }

  private async connection(): Promise<WebhooksConfig> {
      let config = await this.configurationsService.get('integration');
      let conn = JSON.parse(config);
      if (conn.type == CredentialType.FIRE) {
          return new WebhooksFireorm(conn);
      } else {
          return new WebhooksTypeorm(conn);
      }
  }

  public async findAll(): Promise<Webhook[]> {
      const repository = await this.connection();
      return repository.findAll();
  }

  public async findById(id: string): Promise<Webhook | null> {
      const repository = await this.connection();
      return await repository.findById(id);
  }

  public async create(dto: WebhookDto): Promise<Webhook> {
      const repository = await this.connection();
      const timestamp = Math.floor(Date.now() / 1000);
      dto.externalId = `EID-${timestamp}`;
      return await repository.create(dto);
  }

  public async update(
      id: string,
      newValue: WebhookDto,
  ): Promise<Webhook | null> {
      const repository = await this.connection();
      return await repository.update(id, newValue);
  }

  public async delete(id: string) {
      const repository = await this.connection();
      await repository.delete(id);
  }
}

interface WebhooksConfig {
  findAll(): Promise<Webhook[]>;
  findById(id: string): Promise<Webhook | null>;
  create(dto: WebhookDto): Promise<Webhook>;
  update(id: string, newValue: WebhookDto): Promise<Webhook | null>;
  delete(id: string);
}

class WebhooksTypeorm implements WebhooksConfig {
  constructor(
      private connection: any
  ) { }

  private async repository(): Promise<Repository<WebhookEntity>> {
      try {
          const db = getConnection(this.connection['name']);
          return db.getRepository(WebhookEntity);
      } catch (e) {
          const db = await createConnection(this.connection);
          return db.getRepository(WebhookEntity);
      }
  }

  public async findAll(): Promise<Webhook[]> {
      const repository = await this.repository();
      return await repository.find();
  }

  public async findById(id: string): Promise<Webhook | null> {
      const repository = await this.repository();
      return await repository.findOneOrFail(id);
  }

  public async create(dto: WebhookDto): Promise<Webhook> {
      const repository = await this.repository();
      return await repository.save(dto);
  }

  public async update(
      id: string,
      newValue: WebhookDto,
  ): Promise<Webhook | null> {
      const data = await this.findById(id);
      if (!data.id) {
          // tslint:disable-next-line:no-console
          console.error("Webhook doesn't exist");
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

class WebhooksFireorm implements WebhooksConfig {
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

  private async repository(): Promise<fireorm.BaseFirestoreRepository<WebhookCollection> | null> {
      await this.initialize();
      return fireorm.getRepository(WebhookCollection);
  }

  public async findAll(): Promise<Webhook[]> {
      let Webhooks = [];

      const repository = await this.repository();
      let result = await repository.find();
      await Promise.all(result.map(async (res) => {
          Webhooks.push(new Webhook(res));
      }));

      return Webhooks;
  }

  public async findById(id: string): Promise<Webhook | null> {
      const repository = await this.repository();
      let result = await repository.findById(id);
      return new Webhook(result);
  }

  public async create(dto: WebhookDto): Promise<Webhook> {
      const repository = await this.repository();
      let result = await repository.create(dto);

      return new Webhook(result);
  }

  public async update(
      id: string,
      newValue: WebhookDto,
  ): Promise<Webhook | null> {
      const data = await this.findById(id);
      if (!data.id) {
          // tslint:disable-next-line:no-console
          console.error("Webhook doesn't exist");
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
