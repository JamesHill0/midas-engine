import { HttpModule, Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AuthenticationService } from 'src/service/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), HttpModule],
  exports: [TypeOrmModule, AccountsService],
  controllers: [AccountsController],
  providers: [AccountsService, AuthenticationService]
})
export class AccountsModule { }