import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { DeliveriesController } from './deliveries.controller';
import { DeliveriesService } from './deliveries.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [DeliveriesController],
    providers: [DeliveriesService, ConfigurationsService]
})
export class DeliveriesModule { }