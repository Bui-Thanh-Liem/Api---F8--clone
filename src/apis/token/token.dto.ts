import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNotEmptyObject } from 'class-validator';
import { UserEntity } from '../user/user.entity';

export class TokenDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Token code is not empty' })
  token_code: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Token secret key is not empty' })
  token_secretKey: string;

  @ApiProperty()
  @IsNotEmptyObject({ nullable: false }, { message: 'Token user is not empty' })
  token_user: UserEntity;
}
