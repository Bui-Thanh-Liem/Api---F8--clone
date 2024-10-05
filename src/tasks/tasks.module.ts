import { Module } from '@nestjs/common';
import { OtpModule } from '../apis/otp/otp.module';
import { TasksService } from './tasks.service';
import { BlogService } from 'src/apis/blogs/blogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from 'src/apis/blogs/blogs.entity';

@Module({
  imports: [OtpModule, TypeOrmModule.forFeature([BlogEntity])],
  providers: [TasksService, BlogService],
})
export class TasksModule {}
