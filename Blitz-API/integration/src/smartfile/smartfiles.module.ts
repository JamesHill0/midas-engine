import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { SmartFilesController } from './smartfiles.controller';
import { SmartFilesService } from './smartfiles.service';
import { SmartFilesConnService } from './smartfiles.conn.service';
import { AuthenticationService } from 'src/service/authentication.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [SmartFilesController],
    providers: [SmartFilesService, SmartFilesConnService, ConfigurationsService, AuthenticationService]
})
export class SmartFilesModule { }
