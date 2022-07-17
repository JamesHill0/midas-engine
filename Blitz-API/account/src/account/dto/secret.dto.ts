import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CredentialType } from 'src/enums/credential.type';

export class SecretDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @ApiProperty()
    @IsString()
    type: CredentialType;

    @ApiProperty()
    @IsString()
    key: string;
}