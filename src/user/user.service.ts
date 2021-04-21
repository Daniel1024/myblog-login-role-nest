import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, EditUserDto } from './dtos';

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

  async getOne(id: number) {
    const user = await this.userRepo.findOne(id);
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

  async editOne(id: number, dto: EditUserDto) {
    const user = await this.getOne(id);

    const editUser = this.userRepo.merge(user, dto);
    const userEdited = await this.userRepo.save(editUser);

    delete userEdited.password;
    return userEdited;
  }

  async deleteOne(id: number) {
    const user = await this.getOne(id);
    await this.userRepo.remove(user);
  }
}
