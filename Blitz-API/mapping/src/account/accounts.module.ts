import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { MappingsService } from 'src/mapping/mappings.service';
import { AuthenticationService } from 'src/service/authentication.service';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [AccountsController],
    providers: [AccountsService, MappingsService, ConfigurationsService, AuthenticationService]
})
export class AccountsModule { }
