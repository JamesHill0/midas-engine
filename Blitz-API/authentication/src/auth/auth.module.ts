import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtSecretRequestType } from '@nestjs/jwt';
import { environment } from 'src/config/development.env';

@Module({
    imports: [
        JwtModule.register({
            publicKey: environment.secrets.public,
            privateKey: environment.secrets.private,
            signOptions: {
                expiresIn: '3h',
                algorithm: 'RS256'
            }
        })
    ],
    exports: [],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule { }