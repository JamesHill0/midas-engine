import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { AccountsService } from 'src/service/account.service';
import { AuthenticationService } from 'src/service/authentication.service';
import { DataMappingOptionsController } from './data.mapping.options.controller';
import { DataMappingOptionsService } from './data.mapping.options.service';
import { DataMappingsController } from './data.mappings.controller';
import { DataMappingsService } from './data.mappings.service';

@Module({
  imports: [HttpModule],
  exports: [],
  controllers: [DataMappingsController, DataMappingOptionsController],
  providers: [DataMappingsService, DataMappingOptionsService, ConfigurationsService, AuthenticationService, AccountsService]
})
export class DataMappingsModule { }
