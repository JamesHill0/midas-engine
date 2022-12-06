import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { CoursesService } from 'src/course/courses.service';
import { HolesService } from 'src/hole/holes.service';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [GamesController],
    providers: [GamesService, ConfigurationsService, CoursesService, HolesService]
})
export class GamesModule { }