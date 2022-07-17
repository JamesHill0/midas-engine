import { HttpModule, Module } from '@nestjs/common';
import { environment } from './config/development.env';
import { RedisModule } from 'nestjs-redis';

// Module --
import { CoursesModule } from './course/courses.module';
import { HolesModule } from './hole/holes.module';
import { GamesModule } from './game/games.module';
import { TeamsModule } from './team/teams.module';
import { UserInfosModule } from './userinfo/userinfos.module';
import { ConfigurationsService } from './configurations/configurations.service';
import { AuthenticationService } from './service/authentication.service';
import { AccountsService } from './service/account.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthenticationInterceptor } from './interceptor/authentication.interceptor';

@Module({
  imports: [
    RedisModule.register(environment.redis),
    HttpModule,
    CoursesModule,
    HolesModule,
    GamesModule,
    TeamsModule,
    UserInfosModule,
  ],
  controllers: [],
  providers: [
    ConfigurationsService,
    AuthenticationService,
    AccountsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthenticationInterceptor,
    },
  ],
})
export class AppModule { }