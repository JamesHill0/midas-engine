import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [TasksController],
    providers: [TasksService, ConfigurationsService]
})
export class TasksModule { }