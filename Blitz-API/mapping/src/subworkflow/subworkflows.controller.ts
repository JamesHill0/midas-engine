import { Controller, Res, Param, Body, Get, Post, HttpStatus, Logger, Patch, Delete } from '@nestjs/common';
import { SubworkflowDto } from './dto/subworkflow.dto';
import { SubworkflowsService } from './subworkflows.service';

@Controller('subworkflows')
export class SubworkflowsController {

  constructor(
    private readonly subworkflowsService: SubworkflowsService
  ) { }

  @Get()
  public async findAll(@Res() res): Promise<any> {
    try {
      let datas = await this.subworkflowsService.findAll();
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
      let data = await this.subworkflowsService.findById(id);
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
  public async create(@Res() res, @Body() dto: SubworkflowDto): Promise<any> {
    try {
      let data = await this.subworkflowsService.create(dto);
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
  public async update(@Res() res, @Param('id') id, dto: SubworkflowDto): Promise<any> {
    try {
      let data = await this.subworkflowsService.update(id, dto);
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
      await this.subworkflowsService.delete(id);
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
