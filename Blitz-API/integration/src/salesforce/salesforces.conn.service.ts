import { HttpService, Injectable } from '@nestjs/common';

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
        if (auth != null && auth.accessToken != null && auth.instanceUrl != null) {
            let accessToken = await this.authenticationService.decrypt(auth.accessToken);
            let instanceUrl = await this.authenticationService.decrypt(auth.instanceUrl);

            return new Jsforce.Connection({
                accessToken: accessToken["encoded"],
                instanceUrl: instanceUrl["encoded"],
            });
        }

        let loginUrl = await this.authenticationService.decrypt(authBasic.url);

        let conn = new Jsforce.Connection({})

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
}
