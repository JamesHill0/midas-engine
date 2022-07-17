import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { AccountType } from 'src/enums/account.type';
import { StatusType } from 'src/enums/status.type';
import { AccountDetailDto } from './account.detail.dto';
import { SecretDto } from './secret.dto';

export class AccountDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @IsString()
    number: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    type: AccountType;

    @ApiProperty()
    @IsString()
    status: StatusType;

    @IsString()
    apiKey: string;

    @ApiProperty()
    detail: AccountDetailDto;

    @ApiProperty()
    secret: SecretDto;
}
