import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { HolesService } from 'src/hole/holes.service';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [CoursesController],
    providers: [CoursesService, ConfigurationsService, HolesService]
})
export class CoursesModule { }