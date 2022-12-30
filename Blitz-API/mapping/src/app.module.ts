import { HttpModule, Module } from '@nestjs/common';
import { environment } from './config/development.env';
import { RedisModule } from 'nestjs-redis';

// Module --
import { AccountsModule } from './account/accounts.module';
import { MappingsModule } from './mapping/mappings.module';
import { ConfigurationsService } from './configurations/configurations.service';
import { AuthenticationService } from './service/authentication.service';
import { AccountsService } from './service/account.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthenticationInterceptor } from './interceptor/authentication.interceptor';
import { PrioritiesModule } from './priority/priorities.module';
import { WorkflowsModule } from './workflow/workflows.module';
import { SubworkflowsModule } from './subworkflow/subworkflows.module';

@Module({
  imports: [
    RedisModule.register(environment.redis),
    HttpModule,
    AccountsModule,
    MappingsModule,
    PrioritiesModule,
    WorkflowsModule,
    SubworkflowsModule,
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
