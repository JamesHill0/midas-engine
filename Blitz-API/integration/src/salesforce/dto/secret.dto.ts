import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { AuthType } from 'src/enums/auth.type';

export class SecretDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @ApiProperty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsString()
    url: string;

    @ApiProperty()
    @IsString()
    securityToken: string;

    @IsString()
    accessToken: string;

    @IsString()
    instanceUrl: string;

    @IsString()
    refreshToken: string;
}
