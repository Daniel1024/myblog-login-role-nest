import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsEnum,
  IsArray,
} from 'class-validator';
import { EnumToString } from '../../common/helpers/enumToString';
import { PostCategory } from '../enums';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class CreatePostDto {
  @ApiModelProperty()
  @IsString()
  title: string;

  @ApiModelProperty()
  @IsString()
  slug: string;

  @ApiModelProperty()
  @IsString()
  excerpt: string;

  @ApiModelProperty()
  @IsString()
  content: string;

  @ApiModelProperty()
  @IsNotEmpty()
  @IsEnum(PostCategory, {
    message: `Invalid option. Valids options are ${EnumToString(PostCategory)}`,
  })
  category: string;

  @ApiModelProperty()
  @IsString({ each: true })
  @IsArray()
  tags: string[];

  @ApiModelProperty()
  @IsBoolean()
  status: boolean;
}
