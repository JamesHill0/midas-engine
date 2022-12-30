import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { SubworkflowsController } from './subworkflows.controller';
import { SubworkflowsService } from './subworkflows.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [SubworkflowsController],
    providers: [SubworkflowsService, ConfigurationsService]
})
export class SubworkflowsModule { }
