import { Controller, Res, Param, Query, Body, Get, Post, HttpStatus, Logger, Patch, Delete } from '@nestjs/common';
import { MobilesService } from './mobiles.service';
import { MobileDto } from './dto/mobile.dto';

@Controller('mobiles')
export class MobilesController {
    constructor(private readonly mobilesService: MobilesService) { }

    @Get()
    public async findAll(@Query() query, @Res() res): Promise<any> {
        try {
            let datas = await this.mobilesService.findAll(query);
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
            let data = await this.mobilesService.findById(id);
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
    public async create(@Res() res, @Body() dto: MobileDto): Promise<any> {
        try {
            let data = await this.mobilesService.create(dto);
            return res.status(HttpStatus.OK).json({
                data: data,
                message: 'Success!',
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
            let data = await this.mobilesService.update(id, dto);
            return res.status(HttpStatus.OK).json({
                data: data,
                message: 'Success!',
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
            await this.mobilesService.delete(id);
            return res.status(HttpStatus.OK).json({
                message: 'Success!',
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
