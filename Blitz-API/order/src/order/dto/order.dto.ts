import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { OrderStatusType } from 'src/enums/order.status.type';

export class OrderDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    status: OrderStatusType;

    @IsNumber()
    price: number;
}