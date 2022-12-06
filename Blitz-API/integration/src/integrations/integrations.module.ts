import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from '../configurations/configurations.service';
import { SalesforcesService } from '../salesforce/salesforces.service';
import { SmartFilesService } from '../smartfile/smartfiles.service';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [IntegrationsController],
    providers: [IntegrationsService, ConfigurationsService, SalesforcesService, SmartFilesService]
})
export class IntegrationsModule { }
