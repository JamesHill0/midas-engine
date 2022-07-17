import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { RegisteredController } from './registered.controller';
import { RegisteredService } from './registered.service';

@Module({
  imports: [HttpModule],
  exports: [],
  controllers: [RegisteredController],
  providers: [RegisteredService, ConfigurationsService]
})
export class RegisteredModule { }