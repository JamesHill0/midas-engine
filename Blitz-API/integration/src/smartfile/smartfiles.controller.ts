import { Controller, Res, Param, Body, Get, Post, HttpStatus, Logger, Patch, Delete } from '@nestjs/common';
import { AuthenticationService } from 'src/service/authentication.service';
import { SmartFilesService } from './smartfiles.service'
import { SmartFilesConnService } from './smartfiles.conn.service';
import { SmartFileDto } from './dto/smartfile.dto';
import { AuthType } from 'src/enums/auth.type';
import { StatusType } from 'src/enums/status.type';
import { identity } from 'rxjs';

@Controller('smartfiles')
export class SmartFilesController {

  constructor(
    private readonly smartFilesService: SmartFilesService,
    private readonly smartFilesConnService: SmartFilesConnService,
    private readonly authenticationService: AuthenticationService,
  ) { }

  @Get()
  public async findAll(@Res() res): Promise<any> {
    try {
      let datas = await this.smartFilesService.findAll();
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
      let data = await this.smartFilesService.findById(id);
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

  @Get('/:id/ping')
  public async ping(@Res() res, @Param('id') id): Promise<any> {
    try {
      let smartFile = await this.smartFilesService.findById(id);
      let data = await this.smartFilesConnService.ping(smartFile.secret);
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

  @Get('/:id/path/info')
  public async info(@Res() res, @Param('id') id): Promise<any> {
    try {
      let smartFile = await this.smartFilesService.findById(id);
      let data = await this.smartFilesConnService.info(smartFile.secret);
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

  @Get('/:id/info/list_files')
  public async infoListFiles(@Res() res, @Param('id') id): Promise<any> {
    try {
      let smartFile = await this.smartFilesService.findById(id);
      let data = await this.smartFilesConnService.infoListFiles(smartFile.secret);
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

  @Get('/:id/data/:name')
  public async getData(@Res() res, @Param('id') id, @Param('name') name): Promise<any> {
    try {
      let smartFile = await this.smartFilesService.findById(id);
      let data = await this.smartFilesConnService.getOne(name, smartFile.secret);
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

  @Post("/test-connection")
  public async testConnection(@Res() res, @Body() dto: SmartFileDto): Promise<any> {
    try {
      if (dto.secret.type == AuthType.BASIC) {
        let unencodedToken = `${dto.secret.basic.username}:${dto.secret.basic.password}`;
        let encodedToken = Buffer.from(unencodedToken, 'binary').toString('base64');
        dto.secret.key = encodedToken;
      }

      dto.secret.key = await this.authenticationService.encrypt({ "encoded": dto.secret.key });

      await this.smartFilesConnService.ping(dto.secret);

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

  @Post()
  public async create(@Res() res, @Body() dto: SmartFileDto): Promise<any> {
    try {
      if (dto.secret.type == AuthType.BASIC) {
        let unencodedToken = `${dto.secret.basic.username}:${dto.secret.basic.password}`;
        let encodedToken = Buffer.from(unencodedToken, 'binary').toString('base64');
        dto.secret.key = encodedToken;
      }

      dto.secret.key = await this.authenticationService.encrypt({ "encoded": dto.secret.key });
      let data = await this.smartFilesService.create(dto);

      await this.smartFilesConnService.ping(data.secret);

      let smartFileDto = new SmartFileDto();
      smartFileDto.status = StatusType.ACTIVE;
      data = await this.smartFilesService.update(data.id, smartFileDto)

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
  public async update(@Res() res, @Param('id') id, dto: SmartFileDto): Promise<any> {
    try {
      let data = await this.smartFilesService.update(id, dto);
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
      await this.smartFilesService.delete(id);
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

}
