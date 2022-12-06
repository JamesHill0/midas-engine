import { Controller, Res, Param, Query, Body, Get, Post, HttpStatus, Patch, Delete } from '@nestjs/common';
import { PrioritiesService } from './priorities.service';
import { PriorityDto } from './dto/priority.dto';
import { Ctx, MessagePattern, Payload, RmqContext, Transport } from '@nestjs/microservices';

@Controller('priorities')
export class PrioritiesController {

    constructor(private readonly prioritiesService: PrioritiesService) { }

    @Get()
    public async findAll(@Query() query, @Res() res): Promise<any> {
        try {
            let datas = await this.prioritiesService.findAll(query);
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
            let data = await this.prioritiesService.findById(id);
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
    public async create(@Res() res, @Body() dto: PriorityDto): Promise<any> {
        try {
            let data = await this.prioritiesService.create(dto);
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
            let data = await this.prioritiesService.update(id, dto);
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
            await this.prioritiesService.delete(id);
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

    @MessagePattern('priorities.created')
    async handlePrioritiesCreated(@Payload() dto: PriorityDto, @Ctx() context: RmqContext) {
        try {
            const data = await this.prioritiesService.create(dto);
            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();

            channel.ack(originalMsg);
            return data;
        } catch (err) {
            console.log(err);
        }
    } 
}