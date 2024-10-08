import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenModule } from '../token/token.module';
import { TokenEntity } from '../token/token.entity';
import { OtpModule } from '../otp/otp.module';
import { AuthStrategy } from 'src/strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, TokenEntity]),
    PassportModule,
    JwtModule,
    TokenModule,
    OtpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthStrategy],
})
export class AuthModule {}
