import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UnauthorizedException, Logger } from '@nestjs/common';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { createConnection, getConnection } from 'typeorm';
import { AuthenticationService } from 'src/service/authentication.service';
import { AccountsService } from 'src/service/account.service';
import { CredentialType } from 'src/enums/credential.type';
import { ConfigurationsService } from 'src/configurations/configurations.service';

@Injectable()
export class AuthenticationInterceptor implements NestInterceptor {
    constructor(
        private readonly configurationsService: ConfigurationsService,
        private readonly authenticationService: AuthenticationService,
        private readonly accountService: AccountsService
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
        try {
            // Check for Authorization Bearer Token
            const authBearerToken = context.switchToHttp().getRequest().headers['authorization'];
            if (authBearerToken == '' || authBearerToken == null) {
                Logger.warn('Authorization Bearer not found. Checking for API Key');
                // Check for API Key
                const apiKey = context.switchToHttp().getRequest().headers['x-api-key'];
                if (apiKey == '' || apiKey == null) {
                    Logger.error('No Authorization Token found');
                    throw 'Unauthorized';
                } else {
                    const account = await this.getAccountByApiKey(apiKey);
                    if (account != null) await this.setDatabaseConnection(account);
                    else throw 'Unauthorized';
                }
                // Validate Authorization Bearer Token
            } else {
                const token = await this.validateAuthBearerToken(authBearerToken);
                const account = await this.getAccountById(token['account_id'], authBearerToken);
                if (account != null) await this.setDatabaseConnection(account);
                else throw 'Unauthorized';
            }
            return next.handle();
        } catch (err) {
            console.log(err);
            return next.handle().pipe(
                catchError(err => throwError(new UnauthorizedException))
            );
        }
    }

    private async validateAuthBearerToken(authBearerToken: string): Promise<any> {
        const splitToken = authBearerToken.split('Bearer ');
        const token = splitToken[1];

        await this.authenticationService.verifyToken(token);

        return await this.authenticationService.decodeToken(token);
    }

    private async getAccountById(id: string, authBearerToken: string): Promise<any> {
        return await this.accountService.findById(id, authBearerToken);
    }

    private async getAccountByApiKey(apiKey: string): Promise<any> {
        return await this.accountService.findByApiKey(apiKey);
    }

    private async decrypt(secretKey: string): Promise<any> {
        return await this.authenticationService.decrypt(secretKey);
    }

    private async createDatabase(connection: any) {
        try {
            const db = getConnection('master');
            await db.query(`CREATE DATABASE "${connection['database']}"`);
            db.close();
        } catch (e) {
            const db = await createConnection({
                type: connection['type'],
                host: connection['host'],
                port: connection['port'],
                username: connection['username'],
                password: connection['password'],
                database: 'postgres',
                name: 'master',
                synchronize: false
            });
            await db.query(`CREATE DATABASE "${connection['database']}"`);
            db.close();
        }
    }

    private async setDatabaseConnection(account: any) {
        const conn = await this.decrypt(account['secret']['key']);
        if (account['secret']['type'] == CredentialType.FIRE) {
            let connection = {
                type: CredentialType.FIRE,
                key: conn
            }
            await this.configurationsService.set('scheduler', JSON.stringify(connection));
        } else {
            let dbName = `${account['number']}-scheduler`;
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
                console.log('setting scheduler configuration session')
                await this.configurationsService.set('scheduler', JSON.stringify(connection));
            }
        }
    }
}