import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail({ email });

    if (user && await compare(password, user.password)) {
      const { password, ...rest } = user;
      return rest;
    }

    return null;
  }

  login(user: User) {
    const payload = { sub: user.id };

    return {
      user,
      accesToken: this.jwtService.sign(payload)
    };
  }
}
