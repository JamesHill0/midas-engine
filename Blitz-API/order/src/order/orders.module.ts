import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [OrdersController],
    providers: [OrdersService, ConfigurationsService]
})
export class OrdersModule { }