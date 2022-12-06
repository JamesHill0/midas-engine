import { Controller, Res, Body, Post, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post("/verify")
    public async verify(@Res() res, @Body() body: any): Promise<any> {
        try {
            const accessToken = body['access_token'];
            const result = await this.authService.verify(accessToken);
            if (result) {
                return res.status(HttpStatus.OK).json({
                    data: {
                        'access_token': accessToken,
                    },
                    message: 'Success',
                    status: 200,
                })
            }
        } catch (err) {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Internal Server Error',
                status: 500,
            });
        }
    }

    @Post("/generate")
    public async generate(@Res() res, @Body() body: any): Promise<any> {
        try {
            const accessToken = await this.authService.generate(body);
            return res.status(HttpStatus.OK).json({
                data: {
                    'access_token': accessToken,
                },
                message: 'Success',
                status: 200,
            })
        } catch (err) {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Internal Server Error',
                status: 500,
            });
        }
    }

    @Post("/decode")
    public async decode(@Res() res, @Body() body: any): Promise<any> {
        try {
            const accessToken = body['access_token'];
            const data = await this.authService.decode(accessToken);
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

    @Post("/encrypt")
    public async encrypt(@Res() res, @Body() body: any): Promise<any> {
        try {
            const data = await this.authService.encrypt(JSON.stringify(body));
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

    @Post("/decrypt")
    public async decrypt(@Res() res, @Body() body: any): Promise<any> {
        try {
            const token = body['token'];
            const data = await this.authService.decrypt(token);
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
}