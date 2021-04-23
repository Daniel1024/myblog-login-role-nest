import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserRegistrationDto } from './dtos';
import { Auth, User } from '../common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { Resource, Role } from '../app.roles';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { User as UserEntity } from './entities/user.entity';

@ApiTags('Users routes')
@Controller('user')
export class UserController {

  constructor(
    private readonly userService: UserService,
    @InjectRolesBuilder()
    private readonly rolesBuilder: RolesBuilder
  ) { }

  @Get()
  async getMany() {
    const data = await this.userService.getMany();
    return { data };
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number
  ) {
    const data = await this.userService.getOne(id);
    return { data };
  }

  @Post('register')
  async publicRegistration(
    @Body() dto: UserRegistrationDto
  ) {
    const data = await this.userService.createOne({
      ...dto,
      roles: [
        Role.AUTHOR
      ]
    });

    return {
      message: 'User registered',
      data
    }
  }

  @Auth({
    possession: 'any',
    action: 'create',
    resource: Resource.USER
  })
  @Post()
  async createOne(@Body() dto: CreateUserDto) {
    const data = await this.userService.createOne(dto);
    return { message: 'User created', data };
  }

  @Auth({
    possession: 'own',
    action: 'update',
    resource: Resource.USER
  })
  @Put(':id')
  async editOne(
    @Param('id') id: number,
    @Body() dto: CreateUserDto,
    @User() user: UserEntity
  ) {
    let data: UserEntity;
    if (this.rolesBuilder.can(user.roles).updateAny(Resource.USER).granted) {
      // esto es un admin
      data = await this.userService.editOne(id, dto);
    } else {
      // esto es un author
      const { roles, ...rest } = dto;
      data = await this.userService.editOne(id, rest, user);
    }
    return { message: 'User edited', data };
  }

  @Auth({
    possession: 'own',
    action: 'delete',
    resource: Resource.USER
  })
  @Delete(':id')
  async deleteOne(
    @Param('id') id: number,
    @User() user: UserEntity
  ) {
    if (this.rolesBuilder.can(user.roles).updateAny(Resource.USER).granted) {
      // esto es un admin
      await this.userService.deleteOne(id);
    } else {
      // esto es un author
      await this.userService.deleteOne(id, user);
    }
    /*
    await this.userService.deleteOne(id);*/
    return { message: 'User deleted' };
  }
}
