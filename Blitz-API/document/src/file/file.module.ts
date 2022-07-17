import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { FilesController } from './files.controller';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [FilesController],
    providers: [ConfigurationsService]
})
export class FilesModule { }