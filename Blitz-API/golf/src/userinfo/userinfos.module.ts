import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { CoursesService } from 'src/course/courses.service';
import { GamesService } from 'src/game/games.service';
import { HolesService } from 'src/hole/holes.service';
import { TeamsService } from 'src/team/teams.service';
import { UserInfosController } from './userinfos.controller';
import { UserInfosService } from './userinfos.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [UserInfosController],
    providers: [UserInfosService, ConfigurationsService, HolesService,CoursesService, TeamsService, GamesService]
})
export class UserInfosModule { }