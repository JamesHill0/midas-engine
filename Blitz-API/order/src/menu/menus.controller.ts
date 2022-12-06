import { Controller, Res, Param, Body, Get, Post, HttpStatus, Logger, Patch, Delete } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenuDto } from './dto/menu.dto';

@Controller('menus')
export class MenusController {

    constructor(private readonly menusService: MenusService) { }

    @Get()
    public async findAll(@Res() res): Promise<any> {
        try {
            let datas = await this.menusService.findAll();
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

    @Post()
    public async create(@Res() res, @Body() dto: MenuDto): Promise<any> {
        try {
            let data = await this.menusService.create(dto);
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
    public async update(@Res() res, @Param('id') id, dto: MenuDto): Promise<any> {
        try {
            let data = await this.menusService.update(id, dto);
            return res.status(HttpStatus.OK).json({
                data: data,
                message: 'Success',
                status: 200
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
            await this.menusService.delete(id);
            return res.status(HttpStatus.OK).json({
                message: 'Success',
                status: 200,
            });
        } catch (err) {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                messaage: 'Internal Server Error',
                status: 500,
            });
        }
    }
}