import { Injectable } from '@nestjs/common';
import { Integration, IntegrationCollection } from './entities/integrations.entity';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';

import { ConfigurationsService } from '../configurations/configurations.service';
import { SalesforcesService } from '../salesforce/salesforces.service';
import { SmartFilesService } from '../smartfile/smartfiles.service';
import { DirectionType } from '../enums/direction.type';
import { WebhooksService } from 'src/webhook/webhooks.service';

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly configurationsService: ConfigurationsService,
    private readonly salesforcesService: SalesforcesService,
    private readonly smartfilesService: SmartFilesService,
    private readonly webhookService: WebhooksService
  ) { }

  private async connection(): Promise<IntegrationsConfig> {
    let config = await this.configurationsService.get('integration');
    let conn = JSON.parse(config);
    if (conn.type == CredentialType.FIRE) {
      return new IntegrationsFireorm(conn, this.salesforcesService, this.smartfilesService, this.webhookService);
    } else {
      return new IntegrationsTypeorm(conn, this.salesforcesService, this.smartfilesService, this.webhookService);
    }
  }

  public async findAll(): Promise<Integration[]> {
    const repository = await this.connection();
    return repository.findAll();
  }
}

interface IntegrationsConfig {
  findAll(): Promise<Integration[]>;
}

class IntegrationsTypeorm implements IntegrationsConfig {
  constructor(
    private connection: any,
    private salesforceService: SalesforcesService,
    private smartfilesService: SmartFilesService,
    private webhooksService: WebhooksService
  ) { }

  public async findAll(): Promise<Integration[]> {
    let integrations = [];

    let salesforce = await this.salesforceService.findAll()

    salesforce.map((res) => {
      integrations.push(
        new Integration(
          {
            id: res.id,
            name: "Salesforce",
            status: res.status,
            direction: DirectionType.OUTGOING,
            externalId: res.externalId
          }
        )
      )
    })

    let smartfile = await this.smartfilesService.findAll()

    smartfile.map((res) => {
      integrations.push(
        new Integration(
          {
            id: res.id,
            name: "Smartfile",
            status: res.status,
            direction: DirectionType.INCOMING,
            externalId: res.externalId
          }
        )
      )
    })

    let webhooks = await this.webhooksService.findAll()

    webhooks.map((res) => {
      integrations.push(
        new Integration(
          {
            id: res.id,
            name: "Webhook",
            status: res.status,
            direction: DirectionType.INCOMING,
            externalId: res.externalId
          }
        )
      )
    })

    return integrations;
  }
}

class IntegrationsFireorm implements IntegrationsConfig {
  constructor(
    private connection: any,
    private salesforceService: SalesforcesService,
    private smartfilesService: SmartFilesService,
    private webhooksService: WebhooksService
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

  private async repository(): Promise<fireorm.BaseFirestoreRepository<IntegrationCollection> | null> {
    await this.initialize();
    return fireorm.getRepository(IntegrationCollection);
  }

  public async findAll(): Promise<Integration[]> {
    let integrations = [];

    let salesforce = await this.salesforceService.findAll()

    salesforce.map((res) => {
      integrations.push(
        new Integration(
          {
            id: res.id,
            name: "Salesforce",
            status: res.status,
            direction: DirectionType.OUTGOING,
            externalId: res.externalId
          }
        )
      )
    })

    let smartfile = await this.smartfilesService.findAll()

    smartfile.map((res) => {
      integrations.push(
        new Integration(
          {
            id: res.id,
            name: "Smartfile",
            status: res.status,
            direction: DirectionType.INCOMING,
            externalId: res.externalId
          }
        )
      )
    })

    let webhooks = await this.webhooksService.findAll()

    webhooks.map((res) => {
      integrations.push(
        new Integration(
          {
            id: res.id,
            name: "Webhook",
            status: res.status,
            direction: DirectionType.INCOMING,
            externalId: res.externalId
          }
        )
      )
    })

    return integrations;
  }
}
