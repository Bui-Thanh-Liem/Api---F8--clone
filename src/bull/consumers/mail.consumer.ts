import { Process, Processor } from '@nestjs/bull';
import { BadRequestException } from '@nestjs/common';
import { Job } from 'bull';
import { sendMail } from 'src/helpers/mail.helper';

@Processor('send-mail')
export class MailConsumer {
  @Process('otp')
  async Otp(job: Job<any>) {
    console.log('job:::', job.data);
    try {
      await sendMail({
        mailTo: job.data['mailTo'],
        html: job.data['html'],
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    console.log('Success sending mail');
  }
}
