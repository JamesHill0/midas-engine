import { HttpModule, Module } from '@nestjs/common';
import { AppsController } from './apps.controller';
import { AppsService } from './apps.service';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { AuthenticationService } from 'src/service/authentication.service';
import { AccountsService } from 'src/accounts/accounts.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [AppsController],
    providers: [AppsService, AuthenticationService, AccountsService, ConfigurationsService]
})
export class AppsModule { }
