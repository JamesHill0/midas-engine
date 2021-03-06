import { HttpService, Injectable } from '@nestjs/common';

import { AuthType } from 'src/enums/auth.type';

import { AuthenticationService } from 'src/service/authentication.service';
import { Secret } from './entities/secret.entity';

@Injectable()
export class SmartFilesConnService {
    constructor(
        private httpService: HttpService,
        private authenticationService: AuthenticationService,
    ) { }

    private async headers(auth: Secret): any {
        if (auth.type == AuthType.BASIC) {
            let decryptedToken = await this.authenticationService.decrypt(auth.key);
            return {
                "Authorization": `Basic ${decryptedToken}`,
                "Content-Type": "application/json"
            }
        }
    }

    public async ping(auth: Secret): Promise<any> {
        let headerRequest = await this.headers(auth);
        const response = await this.httpService.get(`${process.env.SMART_FILE_URL}/ping`, { headers: headerRequest }).toPromise();
        if (response.status != 200) throw 'Internal Server Error';
        return response.data;
    }

    public async info(auth: Secret): Promise<any> {
        let headerRequest = await this.headers(auth);
        const response = await this.httpService.get(`${process.env.SMART_FILE_URL}/path/info`, { headers: headerRequest }).toPromise();
        if (response.status != 200) throw 'Internal Server Error';
        return response.data;
    }

    public async infoListFiles(auth: Secret): Promise<any> {
        let files = [];
        let headerRequest = await this.headers(auth);
        let response = await this.httpService.get(`${process.env.SMART_FILE_URL}/path/info?children=true`, { headers: headerRequest }).toPromise();
        if (response.status != 200) throw 'Internal Server Error';

        let data = response.data;
        if (data['children'].length > 0) {
            files.push(data['children']);
        }

        let page = data['pages'] + 1
        for(let currentPage=2;currentPage <= page;currentPage++) {
            response = await this.httpService.get(`${process.env.SMART_FILE_URL}/path/info?children=true&page=${currentPage}`, { headers: headerRequest }).toPromise();
            data = response.data;
            if (data['children'].length > 0) {
                files.push(data['children']);
            }
        }

        return files;
    }
}
