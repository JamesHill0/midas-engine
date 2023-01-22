import { HttpModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { environment } from './config/development.env';
import { RedisModule } from 'nestjs-redis';

// Module --
import { SalesforcesModule } from './salesforce/salesforces.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { DatabasesModule } from './database/databases.module';
import { WebhooksModule } from './webhook/webhooks.module';
import { SmartFilesModule } from './smartfile/smartfiles.module';

import { ConfigurationsModule } from './configurations/configurations.module';
import { ConfigurationsService } from './configurations/configurations.service';
import { AuthenticationService } from './service/authentication.service';
import { AccountsService } from './service/account.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthenticationInterceptor } from './interceptor/authentication.interceptor';
import { ConnectionService } from './service/connection.service';

@Module({
  imports: [
    ClientsModule.register([{
      name: 'UPDATE_ACCOUNT_MAPPING_SERVICE',
      transport: Transport.RMQ,
      options: {
        urls: [process.env.SERVICE_RABBITMQ],
        queue: 'blitz-api-mapping',
        queueOptions: {
          durable: true
        }
      }
    }]),
    RedisModule.register(environment.redis),
    HttpModule,
    DatabasesModule,
    WebhooksModule,
    SmartFilesModule,
    SalesforcesModule,
    IntegrationsModule,
    ConfigurationsModule
  ],
  controllers: [],
  providers: [
    ConfigurationsService,
    AuthenticationService,
    AccountsService,
    ConnectionService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthenticationInterceptor,
    },
  ],
})
export class AppModule { }
