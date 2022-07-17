import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { MobilesController } from './mobiles.controlller';
import { MobilesService } from './mobiles.service';

@Module({
  imports: [HttpModule],
  exports: [],
  controllers: [MobilesController],
  providers: [MobilesService, ConfigurationsService]
})
export class MobilesModule { }