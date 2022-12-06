import { HttpModule, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthenticationService } from 'src/service/authentication.service';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { AccountsService } from 'src/service/account.service';

@Module({
  imports: [HttpModule],
  exports: [],
  controllers: [UsersController],
  providers: [UsersService, AuthenticationService, ConfigurationsService, AccountsService]
})
export class UsersModule { }