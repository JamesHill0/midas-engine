import { Controller, Res, Param, Body, Get, Post, HttpStatus, Logger, Patch, Delete, Inject } from '@nestjs/common';
import { AuthenticationService } from 'src/service/authentication.service';
import { SalesforcesService } from './salesforces.service'
import { SalesforcesConnService } from './salesforces.conn.service';
import { SalesforceDto } from './dto/salesforce.dto';
import { StatusType } from 'src/enums/status.type';
import { AccountsService } from 'src/service/account.service';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { createConnection, getConnection } from 'typeorm';
import { CredentialType } from 'src/enums/credential.type';
import { ClientProxy, Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ConnectionService } from 'src/service/connection.service';
import e from 'express';

@Controller('salesforces')
export class SalesforcesController {

  constructor(
    private readonly salesforcesService: SalesforcesService,
    private readonly salesforcesConnService: SalesforcesConnService,
    private readonly authenticationsService: AuthenticationService,
    private readonly connectionService: ConnectionService,
    @Inject('UPDATE_ACCOUNT_MAPPING_SERVICE') private updateAccountMappingService: ClientProxy
  ) { }

  @Get()
  public async findAll(@Res() res): Promise<any> {
    try {
      let datas = await this.salesforcesService.findAll();
      return res.status(HttpStatus.OK).json({
        data: datas,
        message: 'Success',
        status: HttpStatus.OK,
      });
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Get('/:id')
  public async findOne(@Res() res, @Param('id') id): Promise<any> {
    try {
      let data = await this.salesforcesService.findById(id);
      return res.status(HttpStatus.OK).json({
        data: data,
        message: 'Success',
        status: HttpStatus.OK,
      });
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Post()
  public async create(@Res() res, @Body() dto: SalesforceDto): Promise<any> {
    try {
      let encodedUsername = await this.authenticationsService.encrypt({ "encoded": dto.secret.username });
      let encodedPassword = await this.authenticationsService.encrypt({ "encoded": dto.secret.password });
      let encodedUrl = await this.authenticationsService.encrypt({ "encoded": dto.secret.url });
      let encodedSecurityToken = await this.authenticationsService.encrypt({ "encoded": dto.secret.securityToken });

      dto.secret.username = encodedUsername;
      dto.secret.password = encodedPassword;
      dto.secret.url = encodedUrl;
      dto.secret.securityToken = encodedSecurityToken;

      let secret = await this.salesforcesConnService.ping(dto.secret);

      dto.status = StatusType.ACTIVE;
      dto.secret.accessToken = secret["accessToken"];
      dto.secret.instanceUrl = secret["instanceUrl"];
      dto.secret.refreshToken = secret["refreshToken"];

      let data = await this.salesforcesService.create(dto);

      return res.status(HttpStatus.OK).json({
        data: data,
        message: 'Success',
        status: HttpStatus.OK,
      });
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Patch('/:id')
  public async update(@Res() res, @Param('id') id, @Body() dto: SalesforceDto): Promise<any> {
    try {
      let data = await this.salesforcesService.update(id, dto);
      return res.status(HttpStatus.OK).json({
        data: data,
        message: 'Success',
        status: HttpStatus.OK,
      });
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Delete('/:id')
  public async delete(@Res() res, @Param('id') id): Promise<any> {
    try {
      await this.salesforcesService.delete(id);
      return res.status(HttpStatus.OK).json({
        message: 'Success',
        status: HttpStatus.OK,
      });
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Post("/test-connection")
  public async testConnection(@Res() res, @Body() dto: SalesforceDto): Promise<any> {
    try {
      let encodedUsername = await this.authenticationsService.encrypt({ "encoded": dto.secret.username });
      let encodedPassword = await this.authenticationsService.encrypt({ "encoded": dto.secret.password });
      let encodedUrl = await this.authenticationsService.encrypt({ "encoded": dto.secret.url });
      let encodedSecurityToken = await this.authenticationsService.encrypt({ "encoded": dto.secret.securityToken });

      dto.secret.username = encodedUsername;
      dto.secret.password = encodedPassword;
      dto.secret.url = encodedUrl;
      dto.secret.securityToken = encodedSecurityToken;

      await this.salesforcesConnService.ping(dto.secret);

      return res.status(HttpStatus.OK).json({
        data: {},
        message: 'Success',
        status: HttpStatus.OK,
      });
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Get(":id/jsforce/:tableName/getTableFields")
  public async getTableFields(@Res() res, @Param('id') id, @Param('tableName') tableName): Promise<any> {
    try {
      let sf = await this.salesforcesService.findById(id);

      let data = await this.salesforcesConnService.getTableFields(sf.secret, tableName);
      return res.status(HttpStatus.OK).json({
        data: data,
        message: 'Success',
        status: HttpStatus.OK,
      });
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Get(":id/jsforce/all/describeGlobal")
  public async describeGlobal(@Res() res, @Param('id') id): Promise<any> {
    try {
      let sf = await this.salesforcesService.findById(id);

      let data = await this.salesforcesConnService.describeGlobal(sf.secret);
      return res.status(HttpStatus.OK).json({
        data: data,
        message: 'Success',
        status: HttpStatus.OK,
      });
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Get(":id/jsforce/:tableName/getById/:sfId")
  public async getSFDataById(@Res() res, @Param('id') id, @Param('tableName') tableName, @Param('sfId') sfId): Promise<any> {
    try {
      let sf = await this.salesforcesService.findById(id);
      let data = await this.salesforcesConnService.getById(sf.secret, tableName, sfId)
      return res.status(HttpStatus.OK).json({
        data: data,
        message: 'Success',
        status: HttpStatus.OK,
      });
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Post(":id/jsforce/:tableName")
  public async createSFData(@Res() res, @Param('id') id, @Param('tableName') tableName, @Body() dto: any): Promise<any> {
    try {
      let sf = await this.salesforcesService.findById(id);
      let data = await this.salesforcesConnService.create(sf.secret, tableName, dto);
      return res.status(HttpStatus.OK).json({
        data: data,
        message: 'Success',
        status: HttpStatus.OK,
      });
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Post(":id/jsforce/:tableName/bulk")
  public async bulkCreateSFData(@Res() res, @Param('id') id, @Param('tableName') tableName, @Body() dto: any[]): Promise<any> {
    try {
      let sf = await this.salesforcesService.findById(id);
      let data = await this.salesforcesConnService.bulkCreate(sf.secret, tableName, dto);
      return res.status(HttpStatus.OK).json({
        data: data,
        message: 'Success',
        status: HttpStatus.OK,
      });
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Patch(":id/jsforce/:tableName")
  public async updateSFData(@Res() res, @Param('id') id, @Param('tableName') tableName, @Body() dto: any): Promise<any> {
    try {
      let sf = await this.salesforcesService.findById(id);
      let data = await this.salesforcesConnService.update(sf.secret, tableName, dto);
      return res.status(HttpStatus.OK).json({
        data: data,
        message: 'Success',
        status: HttpStatus.OK,
      });
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Patch(":id/jsforce/:tableName/bulk")
  public async bulkUpdateSFData(@Res() res, @Param('id') id, @Param('tableName') tableName, @Body() dto: any[]): Promise<any> {
    try {
      let sf = await this.salesforcesService.findById(id);
      let data = await this.salesforcesConnService.bulkUpdate(sf.secret, tableName, dto);
      return res.status(HttpStatus.OK).json({
        data: data,
        message: 'Success',
        status: HttpStatus.OK,
      });
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern('integrations.salesforce.bulk.created')
  async handleSalseforceBulkCreation(@Payload() payload: any, @Ctx() context: RmqContext) {
    try {
      const apiKey = payload['apiKey']
      await this.connectionService.setUpConnectionUsingApiKey(apiKey);

      let integrationId = payload['integrationId'];
      let tableName = payload['tableName'];
      let datas = payload['data'];

      let sf = await this.salesforcesService.findById(integrationId);
      let data = await this.salesforcesConnService.bulkCreate(sf.secret, tableName, datas);

      let account_mapping_ids = payload['account_mapping_ids'];
      data["results"].map((result, index) => {
        let res = {}

        if (result.hasOwnProperty('id')) {
          res['id'] = result['id']
        }

        if (result.hasOwnProperty('errors')) {
          if (result['errors'].length > 0) {
            res['error'] = result['errors'][0]['message'];
          }
        } else {
          res['error'] = 'N/A'
          res['success'] = 'Yes'
        }

        if (result.hasOwnProperty('success')) {
          res['success'] = result['success']
        }

        this.updateAccountMappingService.emit('accounts.mappings.updated', {
          'apiKey': apiKey,
          'id': account_mapping_ids[index],
          'data': {
            'currentJob': 'done',
            'result': res
          }
        })
      })

      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();

      channel.ack(originalMsg);
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  @MessagePattern('integrations.salesforce.bulk.updated')
  async handleSalseforceBulkUpdate(@Payload() payload: any, @Ctx() context: RmqContext) {
    try {
      const apiKey = payload['apiKey']
      await this.connectionService.setUpConnectionUsingApiKey(apiKey);

      let integrationId = payload['integrationId'];
      let tableName = payload['tableName'];
      let datas = payload['data'];

      let sf = await this.salesforcesService.findById(integrationId);
      let data = await this.salesforcesConnService.bulkUpdate(sf.secret, tableName, datas);

      let account_mapping_ids = payload['account_mapping_ids'];
      let existing_sf_ids = payload['existing_sf_ids']
      data["results"].map((result, index) => {
        let res = {}
        res['id'] = existing_sf_ids[index];

        if (result.hasOwnProperty('errors')) {
          if (result['errors'].length > 0) {
            res['error'] = result['errors'][0]['message'];
          }
        } else {
          res['error'] = 'N/A'
          res['success'] = 'Yes'
        }

        if (result.hasOwnProperty('success')) {
          res['success'] = result['success']
        }

        this.updateAccountMappingService.emit('accounts.mappings.updated', {
          'apiKey': apiKey,
          'id': account_mapping_ids[index],
          'data': {
            'currentJob': 'done',
            'result': res
          }
        })
      })

      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();

      channel.ack(originalMsg);
      return data;
    } catch (err) {
      console.log(err);
    }
  }
}
