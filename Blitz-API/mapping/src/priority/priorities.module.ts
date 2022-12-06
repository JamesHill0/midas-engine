import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { PrioritiesValueService } from './priorities-value.service';
import { PrioritiesValuesController } from './priorities-values.controller';
import { PrioritiesController } from './priorities.controller';
import { PrioritiesService } from './priorities.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [PrioritiesController, PrioritiesValuesController],
    providers: [PrioritiesService, PrioritiesValueService, ConfigurationsService]
})
export class PrioritiesModule { }