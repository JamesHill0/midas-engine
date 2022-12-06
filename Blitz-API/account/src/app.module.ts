import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from './config/development.env';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RedisModule } from 'nestjs-redis';

// Module --
import { AccountsModule } from './account/accounts.module';
import { AuthenticationInterceptor } from './interceptor/authentication.interceptor';
import { ConfigurationsService } from './configurations/configurations.service';
import { AuthenticationService } from './service/authentication.service';
import { AccountsService } from './account/accounts.service';
import { ConfigurationsModule } from './configurations/configurations.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(environment.database),
    RedisModule.register(environment.redis),
    HttpModule,
    AccountsModule,
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
