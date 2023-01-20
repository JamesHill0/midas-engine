import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UnauthorizedException, Logger } from '@nestjs/common';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConnectionService } from 'src/service/connection.service';

@Injectable()
export class AuthenticationInterceptor implements NestInterceptor {
  constructor(
    private readonly connectionService: ConnectionService
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
          const account = await this.connectionService.getAccountByApiKey(apiKey);
          if (account != null) await this.connectionService.setDatabaseConnection(account);
          else throw 'Unauthorized';
        }
        // Validate Authorization Bearer Token
      } else {
        const token = await this.connectionService.validateAuthBearerToken(authBearerToken);
        const account = await this.connectionService.getAccountById(token['account_id'], authBearerToken);
        if (account != null) await this.connectionService.setDatabaseConnection(account);
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
}
