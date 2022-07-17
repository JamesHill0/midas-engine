import { Module } from '@nestjs/common';

// Module --
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
  ],
})
export class AppModule { }
