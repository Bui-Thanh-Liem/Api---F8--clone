import { Module } from '@nestjs/common';
import { OtpModule } from '../otp/otp.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [OtpModule],
  providers: [TasksService],
})
export class TasksModule {}
