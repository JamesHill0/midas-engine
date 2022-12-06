import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { SellerType } from '../../enums/seller.type';

export class SellerDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @IsString()
    name: string;

    @IsString()
    type: SellerType;

    @IsNumber()
    latitude: number;

    @IsNumber()
    longtitude: number;

    @IsString()
    photo: string;
}