import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { MappingsService } from 'src/mapping/mappings.service';
import { AuthenticationService } from 'src/service/authentication.service';
import { AccountMappingsController } from './account.mappings.controller';
import { AccountMappingsService } from './account.mappings.service';
import { AccountsService } from 'src/service/account.service';
import { ConnectionService } from 'src/service/connection.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [AccountMappingsController],
    providers: [AccountMappingsService, MappingsService, ConfigurationsService, AuthenticationService, AccountsService, ConnectionService]
})
export class AccountMappingsModule { }
