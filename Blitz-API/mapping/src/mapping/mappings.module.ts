import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { MappingsController } from './mappings.controller';
import { MappingsService } from './mappings.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [MappingsController],
    providers: [MappingsService, ConfigurationsService]
})
export class MappingsModule { }