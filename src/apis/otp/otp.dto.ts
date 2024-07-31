import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateSessionOtpDto {
  @IsNotEmpty({ message: 'This field is not empty' })
  @ApiProperty({ default: 'buithanhliem5073@gmail.com' })
  email: string;
}

export class SendOtpDto {
  @IsNotEmpty({ message: 'This field is not empty' })
  @IsEmail({}, { message: 'Invalid email address' })
  @ApiProperty({ default: 'buithanhliem5073@gmail.com' })
  email: string;

  @IsNotEmpty({ message: 'This field is not empty' })
  @ApiProperty({ default: 'otpCode' })
  otpCode: string;
}

export class ConfirmOtpDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @ApiProperty({ default: 'buithanhliem5073@gmail.com' })
  email: string;

  @IsNotEmpty({ message: 'This field is not empty' })
  @ApiProperty({ default: 'otpCode' })
  otpCode: string;
}
