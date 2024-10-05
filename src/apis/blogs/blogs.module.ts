import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './blogs.entity';
import { BlogController } from './blogs.controller';
import { BlogService } from './blogs.service';
import { TasksService } from 'src/tasks/tasks.service';
import { OtpModule } from '../otp/otp.module';
import { TokenModule } from '../token/token.module';
import { TokenEntity } from '../token/token.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogEntity, TokenEntity]),
    TokenModule,
    OtpModule,
    JwtModule,
  ],
  providers: [BlogService, TasksService],
  controllers: [BlogController],
  exports: [BlogService],
})
export class BlogModule {}
