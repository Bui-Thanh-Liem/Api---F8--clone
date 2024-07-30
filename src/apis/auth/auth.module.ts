import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from '../token/token.module';
import { TokenEntity } from '../token/token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, TokenEntity]),
    JwtModule,
    TokenModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
