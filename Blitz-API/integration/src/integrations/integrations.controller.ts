import { Controller, Res, Param, Body, Get, Post, HttpStatus, Logger, Patch, Delete } from '@nestjs/common';
import { IntegrationsService } from './integrations.service'

@Controller('integrations')
export class IntegrationsController {
    constructor(
        private readonly integrationsService: IntegrationsService,
    ) { }

    @Get()
    public async findAll(@Res() res): Promise<any> {
        try {
            let datas = await this.integrationsService.findAll();
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
}
