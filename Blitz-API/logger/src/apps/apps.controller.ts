import { Controller, Res, Param, Query, Body, Get, Post, HttpStatus, Logger, Patch, Delete } from '@nestjs/common';
import { AppDto } from './dto/app.dto';
import { AppsService } from './apps.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { AccountsService } from 'src/service/account.service';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { AuthenticationService } from 'src/service/authentication.service';
import { CredentialType } from 'src/enums/credential.type';
import { createConnection, getConnection } from 'typeorm';

@Controller('apps')
export class AppsController {
  constructor(
    private readonly appsService: AppsService,
    private readonly configurationsService: ConfigurationsService,
    private readonly authenticationsService: AuthenticationService,
    private readonly accountsService: AccountsService
  ) { }

  @Get()
  public async findAll(@Query() query, @Res() res): Promise<any> {
    try {
      const datas = await this.appsService.findAll(query);
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

  @Get("/:id")
  public async findOne(@Res() res, @Param('id') id) {
    try {
      const data = await this.appsService.findById(id);
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
  public async create(@Res() res, @Body() dto: AppDto): Promise<any> {
    try {
      const data = await this.appsService.create(dto);
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
      const data = await this.appsService.update(id, dto);
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
      await this.appsService.delete(id);
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

  @MessagePattern('logger.apps.created')
  async handleLoggerAppCreated(@Payload() payload: any, @Ctx() context: RmqContext) {
    try {
      const apiKey = payload['apiKey'];
      await this.setUpConnection(apiKey);

      let dto = payload['data'];
      const data = await this.appsService.create(dto);
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();

      channel.ack(originalMsg);
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
    const account = await this.accountsService.findByApiKey(apiKey);

    const conn = await this.authenticationsService.decrypt(account['secret']['key']);
    if (account['secret']['type'] == CredentialType.FIRE) {
      let connection = {
        type: CredentialType.FIRE,
        key: conn
      }
      await this.configurationsService.set('logger', JSON.stringify(connection));
    } else {
      let dbName = `${account['number']}-logger`;
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
        console.log('setting logger configuration session')
        await this.configurationsService.set('logger', JSON.stringify(connection));
      }
    }
  }
}
