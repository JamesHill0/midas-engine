import { Injectable } from "@nestjs/common";
import { ConfigurationsService } from "src/configurations/configurations.service";
import { AccountsService } from "./account.service";
import { AuthenticationService } from "./authentication.service";
import { CredentialType } from "src/enums/credential.type";
import { createConnection, getConnection } from 'typeorm';

@Injectable()
export class ConnectionService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly accountsService: AccountsService,
    private readonly configurationsService: ConfigurationsService
  ) { }

  public async validateAuthBearerToken(authBearerToken: string): Promise<any> {
    const splitToken = authBearerToken.split('Bearer ');
    const token = splitToken[1];

    await this.authenticationService.verifyToken(token);

    return await this.authenticationService.decodeToken(token);
  }

  public async getAccountById(id: string, authBearerToken: string): Promise<any> {
    return await this.accountsService.findById(id, authBearerToken);
  }

  public async getAccountByApiKey(apiKey: string): Promise<any> {
    return await this.accountsService.findByApiKey(apiKey);
  }

  public async decrypt(secretKey: string): Promise<any> {
    return await this.authenticationService.decrypt(secretKey);
  }

  public async createDatabase(connection: any) {
    try {
      let db = getConnection('master');
      let raw_data = await db.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname='${connection['database']}'`);

      if (raw_data == null) {
        await db.query(`CREATE DATABASE "${connection['database']}"`);
        db.close()
        return;
      }

      db = await createConnection({
        type: connection['type'],
        host: connection['host'],
        port: connection['port'],
        username: connection['username'],
        password: connection['password'],
        database: 'postgres',
        name: 'master',
        synchronize: false
      });

      raw_data = await db.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname='${connection['database']}'`);

      if (raw_data == null) {
        await db.query(`CREATE DATABASE "${connection['database']}"`);
        db.close();
        return;
      }
    } catch (e) {
      console.log(e);
    }
  }

  public async setUpConnectionUsingApiKey(apiKey: any) {
    const account = await this.accountsService.findByApiKey(apiKey);

    const conn = await this.authenticationService.decrypt(account['secret']['key']);
    if (account['secret']['type'] == CredentialType.FIRE) {
      let connection = {
        type: CredentialType.FIRE,
        key: conn
      }
      await this.configurationsService.set('integration', JSON.stringify(connection));
    } else {
      let dbName = `${account['number']}-integration`;
      let connection = {
        type: conn['type'],
        host: conn['host'],
        port: conn['port'],
        username: conn['username'],
        password: conn['password'],
        database: dbName,
        name: dbName,
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,
      };

      try {
        if (account['database']) {
          connection['database'] = account['database'];
          connection['name'] = account['database'];
        } else {
          await this.createDatabase(connection);
        }
      } finally {
        console.log('setting integration configuration session')
        await this.configurationsService.set('integration', JSON.stringify(connection));
      }
    }
  }

  public async setDatabaseConnection(account: any) {
    const conn = await this.decrypt(account['secret']['key']);
    if (account['secret']['type'] == CredentialType.FIRE) {
      let connection = {
        type: CredentialType.FIRE,
        key: conn
      }
      await this.configurationsService.set('integration', JSON.stringify(connection));
    } else {
      let dbName = `${account['number']}-integration`;
      let connection = {
        type: conn['type'],
        host: conn['host'],
        port: conn['port'],
        username: conn['username'],
        password: conn['password'],
        database: dbName,
        name: dbName,
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,
      };

      try {
        if (account['database']) {
          connection['database'] = account['database'];
          connection['name'] = account['database'];
        } else {
          await this.createDatabase(connection);
        }
      } finally {
        console.log('setting integration configuration session')
        await this.configurationsService.set('integration', JSON.stringify(connection));
      }
    }
  }
}
