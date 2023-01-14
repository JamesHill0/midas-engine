import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { DirectFieldMappingsController } from './direct.field.mappings.controller';
import { DirectFieldMappingsService } from './direct.field.mappings.service';

@Module({
  imports: [HttpModule],
  exports: [],
  controllers: [DirectFieldMappingsController],
  providers: [DirectFieldMappingsService, ConfigurationsService]
})
export class DirectFieldMappingsModule { }
