import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { DataMappingOptionsController } from './data.mapping.options.controller';
import { DataMappingOptionsService } from './data.mapping.options.service';
import { DataMappingsController } from './data.mappings.controller';
import { DataMappingsService } from './data.mappings.service';

@Module({
  imports: [HttpModule],
  exports: [],
  controllers: [DataMappingsController, DataMappingOptionsController],
  providers: [DataMappingsService, DataMappingOptionsService, ConfigurationsService]
})
export class DataMappingsModule { }
