import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { User } from '../common/decorators';
import { User as UserEntity } from '../user/entities';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) { }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@User() user: UserEntity) {
    const data = this.authService.login(user);
    return { message: 'Loging succes', data };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile() {
    return 'ESTOS SON TUS DATOS'
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  refresh(@User() user: UserEntity) {
    const data = this.authService.login(user);
    return { message: 'Refresh success', data };
  }
}
