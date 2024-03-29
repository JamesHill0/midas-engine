import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsBoolean } from 'class-validator';
import { JobType } from 'src/enums/job.type';
import { MappingDto } from 'src/mapping/dto/mapping.dto';

export class AccountMappingDto {
    @ApiProperty({required: true})
    @IsString()
    readonly id: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    currentJob: JobType;

    @ApiProperty()
    @IsBoolean()
    protected: boolean;

    @ApiProperty()
    workflowId: string;

    @ApiProperty()
    @IsString()
    externalId: string;

    @ApiProperty()
    mappings: MappingDto[];

    result: string;
}
