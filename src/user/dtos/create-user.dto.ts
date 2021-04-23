import { IsString, IsEmail, MinLength, MaxLength, IsOptional, IsArray, IsEnum } from 'class-validator';
import { Role } from '../../app.roles';
import { EnumToString } from '../../common/helpers/enumToString';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @IsArray()
  @IsEnum(Role, {
    each: true,
    message: `must be a valid role value, ${EnumToString(Role)}`
  })
  roles: string[]
}
