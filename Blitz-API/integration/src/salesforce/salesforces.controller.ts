import { Controller, Res, Param, Body, Get, Post, HttpStatus, Logger, Patch, Delete } from '@nestjs/common';
import { AuthenticationService } from 'src/service/authentication.service';
import { SalesforcesService } from './salesforces.service'
import { SalesforcesConnService } from './salesforces.conn.service';
import { SalesforceDto } from './dto/salesforce.dto';
import { AuthType } from 'src/enums/auth.type';
import { StatusType } from 'src/enums/status.type';
import { resolveSoa } from 'dns';

@Controller('salesforces')
export class SalesforcesController {

  constructor(
    private readonly salesforcesService: SalesforcesService,
    private readonly salesforcesConnService: SalesforcesConnService,
    private readonly authenticationService: AuthenticationService,
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
      let encodedUsername = await this.authenticationService.encrypt({ "encoded": dto.secret.username });
      let encodedPassword = await this.authenticationService.encrypt({ "encoded": dto.secret.password });
      let encodedUrl = await this.authenticationService.encrypt({ "encoded": dto.secret.url });
      let encodedSecurityToken = await this.authenticationService.encrypt({ "encoded": dto.secret.securityToken });

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
      let encodedUsername = await this.authenticationService.encrypt({ "encoded": dto.secret.username });
      let encodedPassword = await this.authenticationService.encrypt({ "encoded": dto.secret.password });
      let encodedUrl = await this.authenticationService.encrypt({ "encoded": dto.secret.url });
      let encodedSecurityToken = await this.authenticationService.encrypt({ "encoded": dto.secret.securityToken });

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

  @Get(":id/jsforce/:tableName/:sfId")
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

}
