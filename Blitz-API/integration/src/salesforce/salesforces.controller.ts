import { Controller, Res, Param, Body, Get, Post, HttpStatus, Logger, Patch, Delete } from '@nestjs/common';
import { AuthenticationService } from 'src/service/authentication.service';
import { SalesforcesService } from './salesforces.service'
import { SalesforcesConnService } from './salesforces.conn.service';
import { SalesforceDto } from './dto/salesforce.dto';
import { AuthType } from 'src/enums/auth.type';
import { StatusType } from 'src/enums/status.type';

@Controller('salesforces')
export class SalesforcesController {

    constructor(
        private readonly salesforcesService: SalesforcesService,
        private readonly salesforcesConnService: SalesforcesConnService,
        private readonly authenticationService: AuthenticationService,
    ) { }

    @Get()
    public async findAll(@Res() res): Promise<any> {
        try {
            let datas = await this.salesforcesService.findAll();
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
            let data = await this.salesforcesService.findById(id);
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
    public async create(@Res() res, @Body() dto: SalesforceDto): Promise<any> {
        try {
            let encodedDomain = await this.authenticationService.encrypt(dto.secret.domain);
            let encodedUsername = await this.authenticationService.encrypt(dto.secret.username);
            let encodedPassword = await this.authenticationService.encrypt(dto.secret.password);

            dto.secret.domain = encodedDomain;
            dto.secret.username = encodedUsername;
            dto.secret.password = encodedPassword;

            let data = await this.salesforcesService.create(dto);

            await this.salesforcesConnService.ping(data.secret);

            let salesforceDto = new SalesforceDto();
            salesforceDto.status = StatusType.ACTIVE;
            data = await this.salesforcesService.update(data.id, salesforceDto)

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
    public async update(@Res() res, @Param('id') id, dto: SalesforceDto): Promise<any> {
        try {
            let data = await this.salesforcesService.update(id, dto);
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
            await this.salesforcesService.delete(id);
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
