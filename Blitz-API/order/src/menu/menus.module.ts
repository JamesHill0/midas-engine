import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [MenusController],
    providers: [MenusService, ConfigurationsService]
})
export class MenusModule { }