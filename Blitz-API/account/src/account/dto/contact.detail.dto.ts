import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column } from 'typeorm';

export class ContactDetailDto {
    @ApiProperty({ required: true })
    @IsString()
    readonly id: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    email: string

    @ApiProperty()
    @IsString()
    number: string;
}
