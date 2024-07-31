import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @ApiProperty({ default: 'liem02@gmail.com' })
  email: string;

  @IsNotEmpty({ message: 'This field is not empty' })
  @ApiProperty({ default: 'liem02' })
  password: string;
}

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @ApiProperty({ default: 'liem02@gmail.com' })
  email: string;

  @IsNotEmpty({ message: 'This field is not empty' })
  @ApiProperty({ default: 'liem02' })
  password: string;

  @IsNotEmpty({ message: 'This field is not empty' })
  @ApiProperty({ default: 'liem02' })
  password_confirm: string;
}
