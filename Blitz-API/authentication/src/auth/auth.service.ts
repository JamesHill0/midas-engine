import { Injectable } from '@nestjs/common';
import { JwtService, JwtVerifyOptions, JwtSignOptions } from '@nestjs/jwt';
import * as Cryptr from 'cryptr';
import { environment } from 'src/config/development.env';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService
    ) { }

    public async verify(token: string) {
        return this.jwtService.verify(token);
    }

    public async generate(payload: any) {
        return this.jwtService.sign(payload);
    }

    public async decode(token: string) {
        return this.jwtService.decode(token);
    }

    public async encrypt(data: string) {
        const encrypter = new Cryptr(environment.secrets.key);
        return encrypter.encrypt(data);
    }

    public async decrypt(data: string) {
        const decrypter = new Cryptr(environment.secrets.key);
        return JSON.parse(decrypter.decrypt(data));
    }
}