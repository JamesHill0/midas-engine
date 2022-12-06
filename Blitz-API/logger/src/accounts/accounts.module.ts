import { HttpModule, Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { ConfigurationsService } from 'src/configurations/configurations.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [AccountsController],
    providers: [AccountsService, ConfigurationsService]
})
export class AccountsModule { }