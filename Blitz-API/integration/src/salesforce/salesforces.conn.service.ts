import { Injectable } from '@nestjs/common';

import * as Jsforce from "jsforce";

import { AuthenticationService } from 'src/service/authentication.service';
import { SecretDto } from './dto/secret.dto';
import { Secret } from './entities/secret.entity';

@Injectable()
export class SalesforcesConnService {
  constructor(
    private authenticationService: AuthenticationService,
  ) { }

  private async connection(auth: Secret, authBasic: SecretDto): Promise<Jsforce.Connection> {
    // if (auth != null && auth.accessToken != null && auth.instanceUrl != null) {
    //   let accessToken = await this.authenticationService.decrypt(auth.accessToken);
    //   let instanceUrl = await this.authenticationService.decrypt(auth.instanceUrl);
    //   let refreshToken = await this.authenticationService.decrypt(auth.refreshToken);

    //   let conn = new Jsforce.Connection({
    //     accessToken: accessToken["encoded"],
    //     instanceUrl: instanceUrl["encoded"],
    //     refreshToken: refreshToken["encoded"],
    //   });

    //   return conn;
    // }
    if (auth != null) {
      authBasic = new SecretDto();
      authBasic.url = auth.url;
      authBasic.username = auth.username;
      authBasic.password = auth.password;
      authBasic.securityToken = auth.securityToken;
    }

    let loginUrl = await this.authenticationService.decrypt(authBasic.url);

    let conn = new Jsforce.Connection({ version: 'v57.0' })

    if (loginUrl["encoded"] != "") {
      conn = new Jsforce.Connection({
        loginUrl: loginUrl["encoded"],
      });
    }

    let username = await this.authenticationService.decrypt(authBasic.username);
    let password = await this.authenticationService.decrypt(authBasic.password);
    let securityToken = await this.authenticationService.decrypt(authBasic.securityToken);

    conn = await this.basicLogin(conn, `${username["encoded"]}`, `${password["encoded"]}${securityToken["encoded"]}`)
    return conn;
  }

  private async basicLogin(conn: Jsforce.Connection, username: string, password: string): Promise<Jsforce.Connection> {
    return new Promise((resolve, reject) => {
      conn.login(`${username}`, `${password}`, (err) => {
        if (err) {
          console.log(err);
          reject('Internal Server Error');
        }
        resolve(conn);
      });
    })
  }

  private async encodeTokens(conn: Jsforce.Connection): Promise<any> {
    let accessToken = await this.authenticationService.encrypt(conn.accessToken);
    let instanceUrl = await this.authenticationService.encrypt(conn.instanceUrl);
    let refreshToken = await this.authenticationService.encrypt(conn.refreshToken);

    return {
      "accessToken": accessToken,
      "instanceUrl": instanceUrl,
      "refreshToken": refreshToken
    }
  }

  public async ping(authBasic: SecretDto): Promise<any> {
    let conn = await this.connection(null, authBasic);

    return await this.encodeTokens(conn);
  }

  public async getTableFields(auth: Secret, tableName: string): Promise<any> {
    let conn = await this.connection(auth, null);

    return new Promise((resolve, reject) => {
      conn.describe(tableName, (err: any, meta: Jsforce.DescribeSObjectResult) => {
        if (err) {
          console.log(err);
          reject('Internal Server Error');
        }

        if (meta == null) {
          console.log('Meta not found');
          reject('Internal Server Error');
        }

        resolve(meta.fields);
      })
    })
  }

  public async getById(auth: Secret, tableName: string, id: string): Promise<any> {
    let conn = await this.connection(auth, null);

    return new Promise((resolve, reject) => {
      conn.sobject(tableName).retrieve(id, (err, data) => {
        if (err) {
          console.log(err);
          reject('Internal Server Error');
        }
        resolve(data);
      })
    })
  }

  public async create(auth: Secret, tableName: string, inputData: any): Promise<any> {
    let conn = await this.connection(auth, null);

    return new Promise((resolve, reject) => {
      conn.sobject(tableName).create(inputData, (err: any, data: Jsforce.RecordResult) => {
        if (err) {
          console.log(err);
          reject('Internal Server Error');
        }
        resolve(data);
      })
    })
  }

  public async bulkCreate(auth: Secret, tableName: string, inputDatas: any[]): Promise<any> {
    let conn = await this.connection(auth, null);

    return new Promise((resolve, reject) => {
      conn.sobject(tableName).create(inputDatas, (err: any, ret: Jsforce.RecordResult[]) => {
        if (err) {
          console.log(err);
          reject('Internal Server Error');
        }

        let data = { "results": [] }
        for (let i = 0; i < ret.length; i++) {
          data["results"].push(ret[i]);
        }

        resolve(data);
      })
    })
  }

  public async update(auth: Secret, tableName: string, inputData: any): Promise<any> {
    let conn = await this.connection(auth, null);

    return new Promise((resolve, reject) => {
      conn.sobject(tableName).update(inputData, (err: any, data: Jsforce.RecordResult) => {
        if (err) {
          console.log(err);
          reject('Internal Server Error');
        }
        resolve(data);
      })
    })
  }

  public async bulkUpdate(auth: Secret, tableName: string, inputDatas: any[]): Promise<any> {
    let conn = await this.connection(auth, null);

    return new Promise((resolve, reject) => {
      conn.sobject(tableName).update(inputDatas, (err: any, ret: Jsforce.RecordResult[]) => {
        if (err) {
          console.log(err);
          reject('Internal Server Error');
        }

        let data = { "results": [] }
        for (let i = 0; i < ret.length; i++) {
          data["results"].push(ret[i]);
        }

        resolve(data);
      })
    })
  }

  public async describeGlobal(auth: Secret): Promise<any> {
    let conn = await this.connection(auth, null);

    return new Promise((resolve, reject) => {
      conn.describeGlobal((err: any, result: Jsforce.DescribeGlobalResult) => {
        if (err) {
          console.log(err);
          reject('Internal Server Error');
        }

        if (result == null) {
          console.log('Result not found');
          reject('Internal Server Error');
        }

        resolve(result);
      })
    })
  }
}
