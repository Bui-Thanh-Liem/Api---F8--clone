import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly otpService: OtpService) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handlCron() {
    await this.otpService.deleteExpiredRecords();
    this.logger.warn('Run Cron deleted expired records otp');
  }

  @Cron(new Date(Date.now() + 10 * 1000))
  async handlCronThenAfter10Seconds() {
    this.logger.error('Handle cron after 10 seconds app start !');
  }
}
