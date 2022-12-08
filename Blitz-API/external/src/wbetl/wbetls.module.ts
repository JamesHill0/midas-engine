import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { WbEtlsController } from './wbetls.controller';
import { WbEtlsService } from './wbetls.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [WbEtlsController],
    providers: [WbEtlsService, ConfigurationsService]
})
export class WbEtlsModule { }
