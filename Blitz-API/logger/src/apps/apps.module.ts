import { HttpModule, Module } from '@nestjs/common';
import { AppsController } from './apps.controller';
import { AppsService } from './apps.service';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { ConnectionService } from 'src/service/connection.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [AppsController],
    providers: [AppsService, ConfigurationsService, ConnectionService]
})
export class AppsModule { }
