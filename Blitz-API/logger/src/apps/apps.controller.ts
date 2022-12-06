import { Controller, Res, Param, Query, Body, Get, Post, HttpStatus, Logger, Patch, Delete } from '@nestjs/common';
import { AppDto } from './dto/app.dto';
import { AppsService } from './apps.service';

@Controller('apps')
export class AppsController {
    constructor(
        private readonly appsService: AppsService,
    ) { }

    @Get()
    public async findAll(@Query() query, @Res() res): Promise<any> {
        try {
            const datas = await this.appsService.findAll(query);
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

    @Get("/:id")
    public async findOne(@Res() res, @Param('id') id) {
        try {
            const data = await this.appsService.findById(id);
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
    public async create(@Res() res, @Body() dto: AppDto): Promise<any> {
        try {
            const data = await this.appsService.create(dto);
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
            const data = await this.appsService.update(id, dto);
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
            await this.appsService.delete(id);
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
