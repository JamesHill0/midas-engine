import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AccountDetailDto {
    @ApiProperty({ required: true })
    @IsString()
    readonly id: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    address: string;
}
