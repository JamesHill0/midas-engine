import { HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class AccountsService {
    constructor(private httpService: HttpService) { }

    public async findById(id: string, authBearerToken: string) {
        const headerRequest = {
            'Authorization': authBearerToken
        }
        const response = await this.httpService.get(`${process.env.SERVICE_ACCOUNT}/accounts/${id}`, { headers: headerRequest }).toPromise();
        if (response.status != HttpStatus.OK) throw 'Internal Server Error';
        return response.data.data;
    }

    public async findByApiKey(apiKey: string) {
        const headerRequest = {
            'x-api-key': apiKey
        }
        const response = await this.httpService.get(`${process.env.SERVICE_ACCOUNT}/accounts/api-key/${apiKey}`, { headers: headerRequest }).toPromise();
        if (response.status != HttpStatus.OK) throw 'Internal Server Error';
        return response.data.data;
    }
}
