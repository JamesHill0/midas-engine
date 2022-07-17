import { HttpService, Injectable } from '@nestjs/common';

import * as Jsforce from "jsforce";

import { AuthenticationService } from 'src/service/authentication.service';
import { Secret } from './entities/secret.entity';

@Injectable()
export class SmartFilesConnService {
    constructor(
        private authenticationService: AuthenticationService,
    ) { }

    private async connection(auth: Secret): Promise<any> {
        let conn = new Jsforce.Connection();

        let domain = await this.authenticationService.decrypt(auth.domain);
        let username = await this.authenticationService.decrypt(auth.username);
        let password = await this.authenticationService.decrypt(auth.password);

        conn.login(`${username}@${domain}`, password, (err) => {
            if (err) throw 'Internal Server Error';
            return conn;
        });

    }

    public async ping(auth: Secret): Promise<any> {
        let conn = await this.connection(auth);
        conn.query('SELECT Id, Name From Account', (err, res) => {
            if (err) throw 'Internal Server Error';
            return res;
        });
    }
}
