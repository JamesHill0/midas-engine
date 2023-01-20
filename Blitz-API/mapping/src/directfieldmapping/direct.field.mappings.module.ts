import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { AccountsService } from 'src/service/account.service';
import { AuthenticationService } from 'src/service/authentication.service';
import { ConnectionService } from 'src/service/connection.service';
import { DirectFieldMappingsController } from './direct.field.mappings.controller';
import { DirectFieldMappingsService } from './direct.field.mappings.service';

@Module({
  imports: [HttpModule],
  exports: [],
  controllers: [DirectFieldMappingsController],
  providers: [DirectFieldMappingsService, ConfigurationsService, AuthenticationService, AccountsService, ConnectionService]
})
export class DirectFieldMappingsModule { }
