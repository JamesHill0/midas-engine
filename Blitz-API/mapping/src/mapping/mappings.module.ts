import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { AccountsService } from 'src/service/account.service';
import { AuthenticationService } from 'src/service/authentication.service';
import { ConnectionService } from 'src/service/connection.service';
import { MappingsController } from './mappings.controller';
import { MappingsService } from './mappings.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [MappingsController],
    providers: [MappingsService, ConfigurationsService, AuthenticationService, AccountsService, ConnectionService]
})
export class MappingsModule { }
