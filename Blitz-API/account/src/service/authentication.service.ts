import { Global, HttpService } from '@nestjs/common';

@Global()
export class AuthenticationService {
    constructor(private httpService: HttpService) { }

    async verifyToken(accessToken: string) {
        const response = await this.httpService.post(`${process.env.SERVICE_AUTHENTICATION}/auth/verify`, { "access_token": accessToken }).toPromise();
        if (response.status != 200) throw 'Internal Server Error';
        return response.data.data;
    }

    async generateToken(params: any) {
        const response = await this.httpService.post(`${process.env.SERVICE_AUTHENTICATION}/auth/generate`, params).toPromise();
        if (response.status != 200) throw 'Internal Server Error';
        return response.data.data;
    }

    async decodeToken(accessToken: string) {
        const response = await this.httpService.post(`${process.env.SERVICE_AUTHENTICATION}/auth/decode`, { "access_token": accessToken }).toPromise();
        if (response.status != 200) throw 'Internal Server Error';
        return response.data.data;
    }

    async encrypt(params: any) {
        const response = await this.httpService.post(`${process.env.SERVICE_AUTHENTICATION}/auth/encrypt`, params).toPromise();
        if (response.status != 200) throw 'Internal Server Error';
        return response.data.data;
    }

    async decrypt(encoded: string) {
        const response = await this.httpService.post(`${process.env.SERVICE_AUTHENTICATION}/auth/decrypt`, { "token": encoded }).toPromise();
        if (response.status != 200) throw 'Internal Server Error';
        return response.data.data;
    }
}