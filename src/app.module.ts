import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from './apis/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './apis/user/user.entity';
import { DataSource } from 'typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './apis/auth/auth.module';
import { TokenEntity } from './apis/token/token.entity';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthController } from './apis/auth/auth.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST_DB || 'localhost',
      port: Number(process.env.PORT_DB) || 3306,
      username: process.env.USERNAME_DB || 'root',
      password: process.env.PASSWORD_DB || 'BuiThanhLiem@113',
      database: process.env.NAME_DB || 'study-nestjs',
      entities: [UserEntity, TokenEntity],
      synchronize: true,
    }),
    PassportModule,
    UserModule,
    AuthModule,
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
