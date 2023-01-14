import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { DataMappingsController } from './data.mappings.controller';
import { DataMappingsService } from './data.mappings.service';

@Module({
  imports: [HttpModule],
  exports: [],
  controllers: [DataMappingsController],
  providers: [DataMappingsService, ConfigurationsService]
})
export class DataMappingsModule { }
