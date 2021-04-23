import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from '../common/decorators';
import { User as UserEntity } from '../user/entities';

@Controller('auth')
export class AuthController {

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@User() user: UserEntity) {
    return user;
  }

  @Get('profile')
  profile() {
    return 'ESTOS SON TUS DATOS'
  }
}
