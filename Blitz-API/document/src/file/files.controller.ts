import { Controller, Res, Post, Param, UseInterceptors, UploadedFile, HttpStatus, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Storage } from '@google-cloud/storage';
import * as fs from 'fs';

import { ConfigurationsService } from 'src/configurations/configurations.service';
import { CredentialType } from 'src/enums/credential.type';

@Controller('files')
export class FilesController {
    constructor(
        private readonly configurationsService: ConfigurationsService
    ) { }

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './files',
            filename: (_, file, callback) => {
                let random = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return callback(null, `${random}${extname(file.originalname)}`);
            }
        })
    }))
    public async upload(@Res() res, @UploadedFile() file, @Body() dto: any): Promise<any> {
        try {
            let config = await this.configurationsService.get('client');
            let conn = JSON.parse(config);
            if (conn.type == CredentialType.FIRE) {
                let storage = new Storage({
                    projectId: conn.key.project_id,
                    credentials: {
                        client_email: conn.key.client_email,
                        private_key: conn.key.private_key,
                    }
                });
                await storage.bucket(dto.bucket).upload(file.filename, {
                    gzip: true,
                    metadata: {
                        cacheControl: 'public, max-age=31536000',
                    }
                });
                await fs.unlinkSync(file.filename);
                return res.status(HttpStatus.OK).json({
                    data: {
                        bucket: dto.bucket,
                        filename: file.filename,
                    },
                    message: 'Success',
                    status: 200,
                });
            } else {
                return res.status(HttpStatus.OK).json({
                    data: {
                        original: file.originalName,
                        filename: file.filename,
                    },
                    message: 'Success',
                    status: 200,
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

    @Post('/download')
    public async download(@Res() res, @Body() dto: any): Promise<any> {
        try {
            let config = await this.configurationsService.get('client');
            let conn = JSON.parse(config);
            if (conn.type == CredentialType.FIRE) {
                let storage = new Storage({
                    projectId: conn.key.project_id,
                    credentials: {
                        client_email: conn.key.client_email,
                        private_key: conn.key.private_key,
                    }
                });
                let url = await storage.bucket(dto.bucket).file(dto.filename).getSignedUrl({
                    version: 'v4',
                    action: 'read',
                    expires: Date.now() + 15 * 60 * 1000
                });
                return res.status(HttpStatus.OK).json({
                    data: url,
                    message: 'Success',
                    status: 200,
                });
            } else {
                return res.status(HttpStatus.OK).json({
                    data: res.sendFile(dto.filename, { root: './files' }),
                    message: 'Success',
                    status: 200,
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
}