import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { SalesforcesController } from './salesforces.controller';
import { SalesforcesService } from './salesforces.service';
import { SalesforcesConnService } from './salesforces.conn.service';
import { AuthenticationService } from 'src/service/authentication.service';
import { AccountsService } from 'src/service/account.service';
import { ConnectionService } from 'src/service/connection.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [HttpModule, ClientsModule.register([{
    name: 'UPDATE_ACCOUNT_MAPPING_SERVICE',
    transport: Transport.RMQ,
    options: {
      urls: [process.env.SERVICE_RABBITMQ],
      queue: 'blitz-api-mapping',
      queueOptions: {
        durable: true
      }
    }
  }])],
  exports: [],
  controllers: [SalesforcesController],
  providers: [SalesforcesService, SalesforcesConnService, ConfigurationsService, AuthenticationService, AccountsService, ConnectionService]
})
export class SalesforcesModule { }
