import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { Auth, User } from '../common/decorators';
import { User as UserEntity } from '../user/entities';
import { AuthService } from './auth.service';

@ApiTags('Auth Routes')
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
  @Auth()
  profile(@User() user: UserEntity) {
    return {
      message: 'Peticion correcta',
      user
    }
  }

  @Post('refresh')
  @Auth()
  refresh(@User() user: UserEntity) {
    const data = this.authService.login(user);
    return { message: 'Refresh success', data };
  }
}
