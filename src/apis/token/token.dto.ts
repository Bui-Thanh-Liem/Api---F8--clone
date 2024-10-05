import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNotEmptyObject } from 'class-validator';
import { UserEntity } from '../user/user.entity';

export class TokenDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Token code is not empty' })
  token_access: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Token code is not empty' })
  token_refresh: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Token key access key is not empty' })
  token_keyAccess: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Token key access key is not empty' })
  token_keyRefresh: string;

  @ApiProperty()
  @IsNotEmptyObject({ nullable: false }, { message: 'Token user is not empty' })
  token_user: UserEntity;
}
