import { Controller, Res, Param, Query, Body, Get, Post, HttpStatus, Logger, Patch, Delete } from '@nestjs/common';
import { RegisteredService } from './registered.service';
import { RegisteredDto } from './dto/registered.dto';

@Controller('registered')
export class RegisteredController {

    constructor(private readonly registeredService: RegisteredService) { }

    @Get()
    public async findAll(@Query() query, @Res() res): Promise<any> {
        try {
            let datas = await this.registeredService.findAll(query);
            return res.status(HttpStatus.OK).json({
                data: datas,
                message: 'Success',
                status: 200,
            });
        } catch (err) {
            console.log(err);
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Bad Request',
                status: 400,
            });
        }
    }

    @Get("/:id")
    public async findOne(@Res() res, @Param('id') id) {
        try {
            let data = await this.registeredService.findById(id);
            return res.status(HttpStatus.OK).json({
                data: data,
                message: 'Success',
                status: 200,
            });
        } catch (err) {
            console.log(err);
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Bad Request',
                status: 400,
            });
        }
    }

    @Post()
    public async create(@Res() res, @Body() dto: RegisteredDto): Promise<any> {
        try {
            let data = await this.registeredService.create(dto);
            return res.status(HttpStatus.OK).json({
                data: data,
                message: 'Success!',
                status: 200,
            });
        } catch (err) {
            console.log(err);
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Bad Request',
                status: 400,
            });
        }
    }

    @Patch('/:id')
    public async update(@Res() res, @Param('id') id, @Body() dto: any): Promise<any> {
        try {
            let data = await this.registeredService.update(id, dto);
            return res.status(HttpStatus.OK).json({
                data: data,
                message: 'Success!',
                status: 200,
            });
        } catch (err) {
            console.log(err);
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Bad Request',
                status: 400,
            });
        }
    }

    @Delete('/:id')
    public async delete(@Res() res, @Param('id') id): Promise<any> {
        try {
            await this.registeredService.delete(id);
            return res.status(HttpStatus.OK).json({
                message: 'Success!',
                status: 200,
            });
        } catch (err) {
            console.log(err);
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Bad Request',
                status: 400,
            });
        }
    }
}
