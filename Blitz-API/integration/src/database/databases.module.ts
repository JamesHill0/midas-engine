import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { DatabasesController } from './databases.controller';
import { DatabasesService } from './databases.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [DatabasesController],
    providers: [DatabasesService, ConfigurationsService]
})
export class DatabasesModule { }
