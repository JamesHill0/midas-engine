import { HttpModule, Module } from '@nestjs/common';
import { environment } from './config/development.env';
import { RedisModule } from 'nestjs-redis';

// Module --
import { AccountMappingsModule } from './accountmapping/account.mappings.module';
import { MappingsModule } from './mapping/mappings.module';
import { ConfigurationsService } from './configurations/configurations.service';
import { AuthenticationService } from './service/authentication.service';
import { AccountsService } from './service/account.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthenticationInterceptor } from './interceptor/authentication.interceptor';
import { PrioritiesModule } from './priorityfieldmapping/priorities.module';
import { WorkflowsModule } from './workflow/workflows.module';
import { SubworkflowsModule } from './subworkflow/subworkflows.module';
import { DirectFieldMappingsModule } from './directfieldmapping/direct.field.mappings.module';
import { DataMappingsModule } from './datamapping/data.mappings.module';
import { ConnectionService } from './service/connection.service';

@Module({
  imports: [
    RedisModule.register(environment.redis),
    HttpModule,
    AccountMappingsModule,
    MappingsModule,
    PrioritiesModule,
    DirectFieldMappingsModule,
    DataMappingsModule,
    WorkflowsModule,
    SubworkflowsModule,
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
