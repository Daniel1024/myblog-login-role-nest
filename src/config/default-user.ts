import { getRepository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_USER_EMAIL, DEFAULT_USER_PASSWORD } from './constants';
import { User } from 'src/user/entities';

export const setDefaultUser = async (config: ConfigService) => {
  const userRepository = getRepository(User);
  const email = config.get<string>(DEFAULT_USER_EMAIL)

  const defaultUser = await userRepository
    .createQueryBuilder()
    .where('email = :email', { email })
    .getOne();

  if (!defaultUser) {
    const adminUser = userRepository.create({
      email,
      password: config.get<string>(DEFAULT_USER_PASSWORD),
      roles: ['ADMIN']
    });

    return userRepository.save(adminUser);
  }
};
