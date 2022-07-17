import { Module } from '@nestjs/common';
import { ConfigurationsService } from "./configurations.service";

@Module({
    imports: [],
    exports: [ConfigurationsService],
    controllers: [],
    providers: [ConfigurationsService]
})
export class ConfigurationsModule { }