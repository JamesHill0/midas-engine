import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
import { MessageType } from 'src/enums/message.type';

export class AccountDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @ApiProperty()
    @IsString()
    accountId: string;

    @ApiProperty()
    @IsString()
    type: MessageType;

    @ApiProperty()
    @IsString()
    message: string;
}