import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsBoolean } from 'class-validator';
import { HoleDto } from 'src/hole/dto/hole.dto';

export class CourseDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNumber()
    slopeRating: number;

    @ApiProperty()
    @IsNumber()
    courseRating: number;

    @ApiProperty()
    @IsNumber()
    yard: number;

    @ApiProperty()
    @IsNumber()
    price: number;

    @ApiProperty()
    @IsString()
    address: string;

    @ApiProperty()
    @IsNumber()
    latitude: number;

    @ApiProperty()
    @IsNumber()
    longtitude: number;

    @ApiProperty()
    @IsBoolean()
    hasVideo: boolean;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    holes: HoleDto[];
}