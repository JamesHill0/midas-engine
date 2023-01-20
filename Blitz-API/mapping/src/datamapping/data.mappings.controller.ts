import { Controller, Res, Param, Query, Body, Get, Post, HttpStatus, Patch, Delete } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { DataMappingsService } from './data.mappings.service';
import { DataMappingDto } from './dto/data.mapping.dto';
import { ConnectionService } from 'src/service/connection.service';

@Controller('data-mappings')
export class DataMappingsController {
  constructor(
    private readonly dataMappingsService: DataMappingsService,
    private readonly connectionService: ConnectionService,
  ) { }

  @Get()
  public async findAll(@Query() query, @Res() res): Promise<any> {
    try {
      let datas = await this.dataMappingsService.findAll(query);
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
      let data = await this.dataMappingsService.findById(id);
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
  public async create(@Res() res, @Body() dto: DataMappingDto): Promise<any> {
    try {
      let data = await this.dataMappingsService.create(dto);
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
      let data = await this.dataMappingsService.update(id, dto);
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
      await this.dataMappingsService.delete(id);
      return res.status(HttpStatus.OK).json({
        message: 'Success',
        status: 200
      });
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        status: 500
      });
    }
  }

  @MessagePattern('data.mappings.created')
  async handleDataMappingsCreated(@Payload() payload: any, @Ctx() context: RmqContext) {
    try {
      const apiKey = payload['apiKey'];
      await this.connectionService.setUpConnectionUsingApiKey(apiKey);

      let dto = payload['data'];
      const data = await this.dataMappingsService.create(dto);
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();

      channel.ack(originalMsg);
      return data;
    } catch (err) {
      console.log(err);
    }
  }
}
