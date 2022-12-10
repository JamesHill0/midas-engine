import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [WorkflowsController],
    providers: [WorkflowsService, ConfigurationsService]
})
export class WorkflowsModule { }
