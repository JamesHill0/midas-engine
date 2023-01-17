import { HttpModule, Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { AuthenticationService } from 'src/service/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job]), HttpModule],
  exports: [TypeOrmModule, JobsService],
  controllers: [JobsController],
  providers: [JobsService, AuthenticationService]
})
export class JobsModule { }
