import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BlogEntity } from 'src/apis/blogs/blogs.entity';
import { OtpEntity } from 'src/apis/otp/otp.entity';
import { PhotoEntity } from 'src/apis/photo/photo.entity';
import { TokenEntity } from 'src/apis/token/token.entity';
import { UserEntity } from 'src/apis/user/user.entity';

export default registerAs(
  'mysql-config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.HOST_DB || 'localhost',
    port: Number(process.env.PORT_DB) || 3306,
    username: process.env.USERNAME_DB || 'root',
    password: process.env.PASSWORD_DB || 'BuiThanhLiem@113',
    database: process.env.NAME_DB || 'study-nestjs',
    entities: [UserEntity, TokenEntity, OtpEntity, PhotoEntity, BlogEntity],
    synchronize: true,
  }),
);
