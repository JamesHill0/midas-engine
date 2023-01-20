import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { PriorityFieldMappingValuesService } from './priority.field.mapping.values.service';
import { PriorityFieldMappingValuesController } from './priority.field.mapping.values.controller';
import { PriorityFieldMappingsController } from './priority.field.mappings.controller';
import { PriorityFieldMappingsService } from './priority.field.mappings.service';
import { AuthenticationService } from 'src/service/authentication.service';
import { AccountsService } from 'src/service/account.service';
import { ConnectionService } from 'src/service/connection.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [PriorityFieldMappingsController, PriorityFieldMappingValuesController],
    providers: [PriorityFieldMappingsService, PriorityFieldMappingValuesService, ConfigurationsService, AuthenticationService, AccountsService, ConnectionService]
})
export class PrioritiesModule { }
