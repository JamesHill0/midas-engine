import { Controller, Res, Param, Body, Get, Post, HttpStatus, Logger, Patch, Delete } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { DeliveryDto } from './dto/delivery.dto';

@Controller('deliveries')
export class DeliveriesController {

    constructor(private readonly deliveriesService: DeliveriesService) { }

    @Get()
    public async findAll(@Res() res): Promise<any> {
        try {
            let datas = await this.deliveriesService.findAll();
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
    public async findOne(@Res() res, @Param('id') id) {
        try {
            let data = await this.deliveriesService.findById(id);
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
    public async create(@Res() res, @Body() dto: DeliveryDto): Promise<any> {
        try {
            let data = await this.deliveriesService.create(dto);
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
    public async update(@Res() res, @Param('id') id, dto: DeliveryDto): Promise<any> {
        try {
            let data = await this.deliveriesService.update(id, dto);
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
            await this.deliveriesService.delete(id);
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
}