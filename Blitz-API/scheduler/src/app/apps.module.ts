import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { AppsController } from './apps.controller';
import { AppsService } from './apps.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [AppsController],
    providers: [AppsService, ConfigurationsService]
})
export class AppsModule { }
