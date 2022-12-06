import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [TeamsController],
    providers: [TeamsService, ConfigurationsService]
})
export class TeamsModule { }