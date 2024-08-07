import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { OtpEntity } from './otp.entity';
import { BullModule } from '@nestjs/bull';
import { MailConsumer } from 'src/bull/consumers/mail.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([OtpEntity]),
    ScheduleModule.forRoot(),
    UserModule,
    BullModule.registerQueue({
      name: "send-mail",
    })
  ],
  controllers: [OtpController],
  providers: [OtpService, MailConsumer],
  exports: [OtpService],
})
export class OtpModule {}
