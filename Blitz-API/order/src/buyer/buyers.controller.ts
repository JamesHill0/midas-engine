import { Controller, Res, Param, Body, Get, Post, HttpStatus, Logger, Patch, Delete } from '@nestjs/common';
import { BuyersService } from './buyers.service';
import { BuyerDto } from './dto/buyer.dto';

@Controller('buyers')
export class BuyersController {

    constructor(private readonly buyersService: BuyersService) { }

    @Get()
    public async findAll(@Res() res): Promise<any> {
        try {
            let datas = await this.buyersService.findAll();
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
            let data = await this.buyersService.findById(id);
            return res.status(HttpStatus.OK).json({
                data: data,
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

    @Post()
    public async create(@Res() res, @Body() dto: BuyerDto): Promise<any> {
        try {
            let data = await this.buyersService.create(dto);
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
    public async update(@Res() res, @Param('id') id, dto: BuyerDto): Promise<any> {
        try {
            let data = await this.buyersService.update(id, dto);
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
            await this.buyersService.delete(id);
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