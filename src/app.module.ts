import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './apis/user/user.module';
import { DataSource } from 'typeorm';
import { AuthModule } from './apis/auth/auth.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthController } from './apis/auth/auth.controller';
import { OtpModule } from './apis/otp/otp.module';
import mysqlConfig from './config/mysql.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TasksModule } from './apis/tasks/tasks.module';
import { PhotoModule } from './apis/photo/photo.module';

@Module({
  imports: [
    // Configs
    ConfigModule.forRoot({
      envFilePath: '.env.dev',
      isGlobal: true,
      load: [mysqlConfig],
    }),

    //
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get<TypeOrmModuleOptions>('mysql-config'),
      inject: [ConfigService],
    }),

    //
    UserModule,
    AuthModule,
    OtpModule,
    PhotoModule,
    TasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude(
        { path: 'auth', method: RequestMethod.GET },
        { path: 'auth', method: RequestMethod.GET },
        // 'auth/*', all routes start with 'auth'
      )
      .forRoutes(AuthController);
  }
}
