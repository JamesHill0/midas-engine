import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { MessageType } from 'src/enums/message.type';

export class AppDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    type: MessageType;

    @ApiProperty()
    @IsString()
    mode: string;

    @ApiProperty()
    @IsString()
    message: string;
}