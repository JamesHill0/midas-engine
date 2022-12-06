import { HttpModule, Module } from '@nestjs/common';
import { environment } from './config/development.env';
import { RedisModule } from 'nestjs-redis';

// Module --
import { AppsModule } from './app/apps.module';
import { TasksModule } from './task/tasks.module';
import { ConfigurationsService } from './configurations/configurations.service';
import { AuthenticationService } from './service/authentication.service';
import { AccountsService } from './service/account.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthenticationInterceptor } from './interceptor/authentication.interceptor';

@Module({
  imports: [
    RedisModule.register(environment.redis),
    HttpModule,
    AppsModule,
    TasksModule,
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