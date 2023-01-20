import { HttpService, Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationService {
  constructor(private httpService: HttpService) { }

  public async verifyToken(accessToken: string) {
    const response = await this.httpService.post(`${process.env.SERVICE_AUTHENTICATION}/auth/verify`, { "access_token": accessToken }).toPromise();
    if (response.status != 200) throw 'Internal Server Error';
    return response.data.data;
  }

  public async generateToken(params: any) {
    const response = await this.httpService.post(`${process.env.SERVICE_AUTHENTICATION}/auth/generate`, params).toPromise();
    if (response.status != 200) throw 'Internal Server Error';
    return response.data.data;
  }

  public async decodeToken(accessToken: string) {
    const response = await this.httpService.post(`${process.env.SERVICE_AUTHENTICATION}/auth/decode`, { "access_token": accessToken }).toPromise();
    if (response.status != 200) throw 'Internal Server Error';
    return response.data.data;
  }

  public async decrypt(encoded: string) {
    const response = await this.httpService.post(`${process.env.SERVICE_AUTHENTICATION}/auth/decrypt`, { "token": encoded }).toPromise();
    if (response.status != 200) throw 'Internal Server Error';
    return response.data.data;
  }
}
