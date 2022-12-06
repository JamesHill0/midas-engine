import { HttpModule, Module } from '@nestjs/common';
import { environment } from './config/development.env';
import { RedisModule } from 'nestjs-redis';

// Module --
import { WebhooksModule } from './webhook/webhooks.module';
import { SmartFilesModule } from './smartfile/smartfiles.module';
import { ConfigurationsModule } from './configurations/configurations.module';
import { ConfigurationsService } from './configurations/configurations.service';
import { AuthenticationService } from './service/authentication.service';
import { AccountsService } from './service/account.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthenticationInterceptor } from './interceptor/authentication.interceptor';
import { SalesforcesModule } from './salesforce/salesforces.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { DatabasesModule } from './database/databases.module';

@Module({
  imports: [
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
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthenticationInterceptor,
    },
  ],
})
export class AppModule { }
