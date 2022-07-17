import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { SellersController } from './sellers.controller';
import { SellersService } from './sellers.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [SellersController],
    providers: [SellersService, ConfigurationsService]
})
export class SellersModule { }