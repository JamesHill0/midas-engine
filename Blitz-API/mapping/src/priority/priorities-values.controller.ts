import { Controller, Res, Param, Query, Body, Get, Post, HttpStatus, Patch, Delete } from '@nestjs/common';
import { PrioritiesValueService } from './priorities-value.service';
import { PriorityValueDto } from './dto/priority-value.dto';

@Controller('priorities-values')
export class PrioritiesValuesController {
    constructor(
        private readonly prioritiesValuesService: PrioritiesValueService,
    ) { }

    @Get()
    public async findAllPriorityValues(@Query() query, @Res() res): Promise<any> {
        try {
            let datas = await this.prioritiesValuesService.findAll(query);
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
    public async findOnePriorityValue(@Res() res, @Param('id') id): Promise<any> {
        try {
            let data = await this.prioritiesValuesService.findById(id);
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
    public async createPriorityValue(@Res() res, @Body() dto: PriorityValueDto): Promise<any> {
        try {
            let data = await this.prioritiesValuesService.create(dto);
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
    public async updatePriorityValue(@Res() res, @Param('id') id, @Body() dto: any): Promise<any> {
        try {
            let data = await this.prioritiesValuesService.update(id, dto);
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
    public async deletePriorityValue(@Res() res, @Param('id') id): Promise<any> {
        try {
            await this.prioritiesValuesService.delete(id);
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