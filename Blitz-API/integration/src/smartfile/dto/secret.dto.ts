import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { AuthType } from 'src/enums/auth.type';
import { BasicAuthDto } from './basic.auth.dto';

export class SecretDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @ApiProperty()
    @IsString()
    type: AuthType;

    @ApiProperty()
    basic: BasicAuthDto;

    @ApiProperty()
    directory: string;

    key: string;
}
