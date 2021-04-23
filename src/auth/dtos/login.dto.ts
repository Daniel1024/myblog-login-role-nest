import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class LoginDto {

  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  password: string;
}
