import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { OtpEntity } from './otp.entity';
import { BullModule } from '@nestjs/bull';
import { MailConsumer } from 'src/bull/consumers/mail.consumer';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([OtpEntity]),
    ScheduleModule.forRoot(),
    UserModule,
    BullModule.registerQueue({
      name: 'send-mail',
    }),

    //
    // CacheModule.register({
    //   ttl: 10
    // })
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          isGlobal: true,
          store: typeof redisStore,
          host: 'localhost',
          port: 6379,
        };
      },
    }),
  ],
  controllers: [OtpController],
  providers: [OtpService, MailConsumer],
  exports: [OtpService],
})
export class OtpModule {}
