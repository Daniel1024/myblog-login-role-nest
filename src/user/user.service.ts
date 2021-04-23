import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, EditUserDto } from './dtos';

export interface UserFindOne {
  id?: number;
  email?: string;
}

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {
  }

  getMany() {
    return this.userRepo.find();
  }

  async getOne(id: number, userE?: User) {
    const user = await this.userRepo.findOne(id)
      .then((u) => !userE ? u : !!u && userE.id === u.id ? u : null);

    if (!user) {
      throw new NotFoundException('User does not exists');
    }

    return user;
  }

  async createOne(dto: CreateUserDto) {
    const userExist = await this.userRepo.findOne({ email: dto.email });
    if (userExist) {
      throw new BadRequestException('User already registered with email');
    }

    const newUser = this.userRepo.create(dto);
    const user = await this.userRepo.save(newUser);

    delete user.password;
    return user;
  }

  async editOne(id: number, dto: EditUserDto, userE?: User) {
    const user = await this.getOne(id, userE);

    const editUser = this.userRepo.merge(user, dto);
    const userEdited = await this.userRepo.save(editUser);

    delete userEdited.password;
    return userEdited;
  }

  async deleteOne(id: number, userE?: User) {
    const user = await this.getOne(id, userE);
    await this.userRepo.remove(user);
  }

  async findByEmail(data: UserFindOne): Promise<User> {
    return this.userRepo
      .createQueryBuilder('user')
      .where(data)
      .addSelect('user.password')
      .getOne();
  }
}
