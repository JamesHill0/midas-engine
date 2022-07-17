import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { HoleVideoDto } from './hole_video.dto';
import { HoleImageDto } from './hole_image.dto';
import { HoleLocationDto } from './hole_location.dto';

export class HoleDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @IsString()
    courseId: string;

    @IsNumber()
    number: number;

    @IsNumber()
    par: number;

    @ApiProperty()
    locations: HoleLocationDto[];

    @ApiProperty()
    videos: HoleVideoDto[];

    @ApiProperty()
    images: HoleImageDto[];
}