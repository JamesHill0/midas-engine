import { Controller, Res, Param, Query, Body, Get, Post, HttpStatus, Logger, Patch, Delete, Headers } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { AuthenticationService } from 'src/service/authentication.service';
import { AccountsService } from 'src/service/account.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authenticationService: AuthenticationService,
        private readonly accountsService: AccountsService,
    ) { }

    @Get()
    public async findAll(@Query() query, @Res() res): Promise<any> {
        try {
            const datas = await this.usersService.findAll(query);
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
            const data = await this.usersService.findById(id);
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
    public async create(@Res() res, @Body() dto: UserDto): Promise<any> {
        try {
            const data = await this.usersService.create(dto);
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

    @Post('/register')
    public async register(@Headers() headers, @Res() res, @Body() dto: UserDto): Promise<any> {
        try {
            const apiKey = headers['x-api-key'];
            const account = await this.accountsService.findByApiKey(apiKey);
            const data = await this.usersService.create(dto);
            if (data) {
                const response = await this.authenticationService.generateToken({
                    'account_id': account['id'],
                    'user_id': data.id,
                    'username': data.username,
                    'status': data.status,
                });

                response['account_id'] = account['id'];
                response['user_id'] = data.id;
                response['username'] = data.username;
                return res.status(HttpStatus.OK).json({
                    data: response,
                    message: 'Success',
                    status: 200,
                });
            } else {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    message: 'Unauthorized',
                    status: 401,
                });
            }
        } catch (err) {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Internal Server Error',
                status: 500
            });
        }
    }

    @Post('/login')
    public async login(@Headers() headers, @Res() res, @Body('username') username: string, @Body('password') password: string) {
        try {
            const apiKey = headers['x-api-key'];
            const account = await this.accountsService.findByApiKey(apiKey);
            const data = await this.usersService.login(username, password);
            if (data) {
                const response = await this.authenticationService.generateToken({
                    'account_id': account['id'],
                    'user_id': data.id,
                    'username': data.username,
                    'status': data.status,
                });

                response['account_id'] = account['id'];
                response['user_id'] = data.id;
                response['username'] = data.username;

                console.log(response);
                return res.status(HttpStatus.OK).json({
                    data: response,
                    message: 'Success',
                    status: 200,
                });
            } else {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    message: 'Unauthorized',
                    status: 401,
                });
            }
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
            const data = await this.usersService.update(id, dto);
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
            await this.usersService.delete(id);
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
