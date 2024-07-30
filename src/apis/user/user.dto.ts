import { ApiProperty } from '@nestjs/swagger';
import { MinLength, IsEmail, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

// Đóng gói dữ liệu và truyền giữa các tầng của ứng dụng
// Kiểm tra tính hợp lệ của dữ liệu đầu vào
// Xác định cấu trúc dữ liệu đầu vào
// Biến đổi dữ liệu đầu vào
// Tài liệu hóa API
export class UserDto {
  // @Type(() => String)
  @MinLength(5, { message: 'This field must be at least 5 characters Liem' })
  @ApiProperty({ type: String, default: 'liem02' })
  fullname: string;

  @IsNotEmpty({ message: 'Birth is not empty' })
  @ApiProperty({ type: String, default: '08-01-2000' })
  birth: string;

  @IsEmail({}, { message: 'Ivalid email address' })
  @ApiProperty({ type: String, default: 'liem02@gmail.com' })
  email: string;

  @IsNotEmpty({ message: 'Password is not empty' })
  @MinLength(5, { message: 'Password must be at least 5 characters' })
  @ApiProperty({ type: String, default: 'liem02' })
  password?: string;
}
