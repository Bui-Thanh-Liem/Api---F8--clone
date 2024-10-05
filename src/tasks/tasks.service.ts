import { Injectable, Logger } from '@nestjs/common';
// import { OtpService } from 'src/apis/otp/otp.service';
import { CronJob } from 'cron';
import { BlogEntity, ITimer } from 'src/apis/blogs/blogs.entity';
import { BlogService } from 'src/apis/blogs/blogs.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private cronJobs: Map<string, CronJob> = new Map();

  constructor(private blogService: BlogService) {}

  createCronJob(blog: BlogEntity) {
    // Check exist , if exist then clear
    if (this.cronJobs.has(blog.id)) {
      this.cronJobs.get(blog.id)?.stop(); // Dừng cron job cũ
    }

    const timer = this.handleGeneratorCronTime(blog.timer);
    const cronJob = new CronJob(
      timer,
      () => {
        this.handleCronJob(blog.id); // Gọi hàm đăng bài cho blog
      },
      null,
      true,
      'Asia/Ho_Chi_Minh',
    );

    this.cronJobs.set(blog.id, cronJob); // Lưu cron job vào map
    cronJob.start();
  }

  updateCronTime(blog: BlogEntity) {
    this.createCronJob(blog);
  }

  private async handleCronJob(id: string) {
    await this.blogService.setPostBelongTimer(id);
    this.logger.log('Get id blog from redis and set isPost of blog true');

    const cronJob = this.cronJobs.get(id);
    if (cronJob) {
      cronJob.stop();
      this.cronJobs.delete(id);
    }
  }

  private handleGeneratorCronTime(cronTime: ITimer) {
    const timer = {
      HOURS: `${cronTime.value} * * * *`,
      DAY: `0 ${cronTime.value} * * *`,
      WEEK: `0 0 * * ${cronTime.value}`
    }
    return timer[cronTime.type];
  }
}
