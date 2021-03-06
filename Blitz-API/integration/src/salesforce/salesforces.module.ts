import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { SalesforcesController } from './salesforces.controller';
import { SalesforcesService } from './salesforces.service';
import { SalesforcesConnService } from './salesforces.conn.service';
import { AuthenticationService } from 'src/service/authentication.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [SalesforcesController],
    providers: [SalesforcesService, SalesforcesConnService, ConfigurationsService, AuthenticationService]
})
export class SalesforcesModule { }
