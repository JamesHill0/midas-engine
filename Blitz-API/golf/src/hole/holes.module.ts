import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { HolesController } from './holes.controller';
import { HolesService } from './holes.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [HolesController],
    providers: [HolesService, ConfigurationsService]
})
export class HolesModule { }