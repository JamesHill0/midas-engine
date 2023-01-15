import { Controller, Res, Param, Query, Body, Get, Post, HttpStatus, Patch, Delete } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import * as Accounts from 'src/service/account.service';
import { AccountDto } from './dto/account.dto';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { AuthenticationService } from 'src/service/authentication.service';
import { CredentialType } from 'src/enums/credential.type';
import { createConnection, getConnection } from 'typeorm';

@Controller('accounts')
export class AccountsController {

  constructor(
    private readonly accountsService: AccountsService,
    private readonly configurationsService: ConfigurationsService,
    private readonly authenticationsService: AuthenticationService,
    private readonly mainAccountsService: Accounts.AccountsService,
  ) { }

  @Get()
  public async findAll(@Query() query, @Res() res): Promise<any> {
    try {
      let datas = await this.accountsService.findAll(query);
      return res.status(HttpStatus.OK).json({
        data: datas,
        message: 'Success',
        status: 200,
      });
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        status: 500,
      });
    }
  }

  @Get('/:id')
  public async findOne(@Res() res, @Param('id') id): Promise<any> {
    try {
      let data = await this.accountsService.findById(id);
      return res.status(HttpStatus.OK).json({
        data: data,
        message: 'Success',
        status: 200,
      });
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        status: 500,
      });
    }
  }

  @Post()
  public async create(@Res() res, @Body() dto: AccountDto): Promise<any> {
    try {
      let data = await this.accountsService.create(dto);
      return res.status(HttpStatus.OK).json({
        data: data,
        message: 'Success',
        status: 200,
      });
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        status: 500,
      });
    }
  }

  @Patch('/:id')
  public async update(@Res() res, @Param('id') id, @Body() dto: any): Promise<any> {
    try {
      let data = await this.accountsService.update(id, dto);
      return res.status(HttpStatus.OK).json({
        data: data,
        message: 'Success',
        status: 200,
      });
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        status: 500,
      });
    }
  }

  @Delete('/:id')
  public async delete(@Res() res, @Param('id') id): Promise<any> {
    try {
      await this.accountsService.delete(id);
      return res.status(HttpStatus.OK).json({
        message: 'Success',
        status: 200,
      });
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        status: 500,
      });
    }
  }

  @MessagePattern('account.mappings.created')
  async handleAccountMappingsCreated(@Payload() payload: any, @Ctx() context: RmqContext) {
    try {
      const apiKey = payload['apiKey'];
      await this.setUpConnection(apiKey);

      let dto = payload['data'];
      const data = await this.accountsService.create(dto);
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();

      channel.ack(originalMsg);
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  @MessagePattern('account.mappings.updated')
  async handleAccountMappingsUpdated(@Payload() payload: any, @Ctx() context: RmqContext) {
    try {
      const apiKey = payload['apiKey'];
      await this.setUpConnection(apiKey);

      let id = payload['id'];
      let dto = payload['data'];
      const data = await this.accountsService.update(id, dto);
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();

      channel.ack(originalMsg);
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  private async createDatabase(connection: any) {
    try {
      const db = getConnection('master');
      await db.query(`CREATE DATABASE "${connection['database']}"`);
      db.close();
    } catch (e) {
      const db = await createConnection({
        type: connection['type'],
        host: connection['host'],
        port: connection['port'],
        username: connection['username'],
        password: connection['password'],
        database: 'postgres',
        name: 'master',
        synchronize: false
      });
      await db.query(`CREATE DATABASE "${connection['database']}"`);
      db.close();
    }
  }

  private async setUpConnection(apiKey: any) {
    const account = await this.mainAccountsService.findByApiKey(apiKey);

    const conn = await this.authenticationsService.decrypt(account['secret']['key']);
    if (account['secret']['type'] == CredentialType.FIRE) {
      let connection = {
        type: CredentialType.FIRE,
        key: conn
      }
      await this.configurationsService.set('mapping', JSON.stringify(connection));
    } else {
      let dbName = `${account['number']}-mapping`;
      let connection = {
        type: conn['type'],
        host: conn['host'],
        port: conn['port'],
        username: conn['username'],
        password: conn['password'],
        database: dbName,
        name: dbName,
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,
      };

      try {
        if (account['database']) {
          connection['database'] = account['database'];
          connection['name'] = account['database'];
        } else {
          await this.createDatabase(connection);
        }
      } finally {
        console.log('setting mapping configuration session')
        await this.configurationsService.set('mapping', JSON.stringify(connection));
      }
    }
  }
}
