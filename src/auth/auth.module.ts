import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategies';

@Module({
  imports: [
    PassportModule,
    UserModule
  ],
  providers: [
    AuthService,
    LocalStrategy
  ],
  controllers: [AuthController]
})
export class AuthModule {}
