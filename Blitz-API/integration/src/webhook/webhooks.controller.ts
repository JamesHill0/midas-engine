import { Controller, Res, Param, Body, Get, Post, HttpStatus, Logger, Patch, Delete } from '@nestjs/common';
import { WebhookDto } from './dto/webhook.dto';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {

  constructor(
    private readonly webhooksService: WebhooksService
  ) { }

  @Get()
  public async findAll(@Res() res): Promise<any> {
    try {
      let datas = await this.webhooksService.findAll();
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
      let data = await this.webhooksService.findById(id);
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
  public async create(@Res() res, @Body() dto: WebhookDto): Promise<any> {
    try {
      let data = await this.webhooksService.create(dto);
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
  public async update(@Res() res, @Param('id') id, dto: WebhookDto): Promise<any> {
    try {
      let data = await this.webhooksService.update(id, dto);
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
      await this.webhooksService.delete(id);
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
