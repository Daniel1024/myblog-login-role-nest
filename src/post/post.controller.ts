import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PostService } from './post.service';
import { CreatePostDto, EditPostDto } from './dtos';
import { Auth, User } from '../common/decorators';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { Resource } from '../app.roles';
import { User as UserEntity } from '../user/entities';

@ApiTags('Posts')
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    @InjectRolesBuilder()
    private readonly roleBuilder: RolesBuilder
  ) {}

  @Get()
  async getMany() {
    const data = await this.postService.getMany();
    return { data };
  }

  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe
    ) id: number) {
    const data = await this.postService.getById(id);
    return { data };
  }

  @Auth({
    resource: Resource.POST,
    action: 'create',
    possession: 'own',
  })
  @Post()
  async createPost(
    @Body() dto: CreatePostDto,
    @User() author: UserEntity
  ) {
    const data = await this.postService.createOne(dto, author);
    return { message: 'Post created', data };
  }

  @Auth({
    resource: Resource.POST,
    action: 'update',
    possession: 'own',
  })
  @Put(':id')
  async editOne(
    @Param('id') id: number,
    @Body() dto: EditPostDto,
    @User() author: UserEntity,
  ) {
    let data;

    if (
      this.roleBuilder.can(author.roles).updateAny(Resource.POST).granted
    ) {
      // Puede editar cualquier POST...
      data = await this.postService.editOne(id, dto);
    } else {
      // Puede editar solo los propios...
      data = await this.postService.editOne(id, dto, author);
    }

    return { message: 'Post edited', data };
  }

  @Auth({
    resource: Resource.POST,
    action: 'delete',
    possession: 'own',
  })
  @Delete(':id')
  async deleteOne(
    @Param('id') id: number,
    @User() author: UserEntity
  ) {
    if (
      this.roleBuilder.can(author.roles).deleteAny(Resource.POST).granted
    ) {
      await this.postService.deleteOne(id);
    } else {
      await this.postService.deleteOne(id, author);
    }
    return { message: 'Post deleted' };
  }
}
