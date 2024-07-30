import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from './token.entity';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([TokenEntity]), JwtModule],
    providers: [TokenService],
    exports: [TokenService]
})
export class TokenModule {}
