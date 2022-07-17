import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { AuthType } from 'src/enums/auth.type';

export class SecretDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @ApiProperty()
    @IsString()
    domain: string;

    @ApiProperty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsString()
    password: string;
}
