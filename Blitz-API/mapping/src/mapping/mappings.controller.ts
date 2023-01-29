import { Controller, Res, Param, Query, Body, Get, Post, HttpStatus, Patch, Delete } from '@nestjs/common';
import { MappingsService } from './mappings.service';
import { MappingDto } from './dto/mapping.dto';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ConnectionService } from 'src/service/connection.service';

@Controller('mappings')
export class MappingsController {

  constructor(
    private readonly mappingsService: MappingsService,
    private readonly connectionService: ConnectionService
  ) { }

  @Get()
  public async findAll(@Query() query, @Res() res): Promise<any> {
    try {
      let datas = await this.mappingsService.findAll(query);
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
      let data = await this.mappingsService.findById(id);
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
  public async create(@Res() res, @Body() dto: MappingDto): Promise<any> {
    try {
      let data = await this.mappingsService.create(dto);
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
      let data = await this.mappingsService.update(id, dto);
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
      await this.mappingsService.delete(id);
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

  @MessagePattern('mappings.updated')
  async handleMappingsUpdated(@Payload() payload: any, @Ctx() context: RmqContext) {
    try {
      const apiKey = payload['apiKey'];
      await this.connectionService.setUpConnectionUsingApiKey(apiKey);

      let id = payload['id'];
      let dto = payload['data'];
      const data = await this.mappingsService.update(id, dto);
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();

      channel.ack(originalMsg);
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  @MessagePattern('mappings.deleted')
  async handleMappingsDeleted(@Payload() payload: any, @Ctx() context: RmqContext) {
    try {
      const apiKey = payload['apiKey'];
      await this.connectionService.setUpConnectionUsingApiKey(apiKey);

      let datas = payload['data'];
      await datas.map(async (data: any) => {
        await this.mappingsService.delete(data['id']);
      })

      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();

      channel.ack(originalMsg);
    } catch (err) {
      console.log(err);
    }
  }
}
