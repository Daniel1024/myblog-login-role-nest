import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/entities';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(private readonly userService: UserService) {
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail({ email });

    if (user && await compare(password, user.password)) {
      return user;
    }

    return null;
  }
}
