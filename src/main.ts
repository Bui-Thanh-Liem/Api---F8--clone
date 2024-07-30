declare const module: any;
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './middlewares/errors.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware
  app.setGlobalPrefix('/api/v1'); // prefix for API routes
  app.use(helmet()); // bảo mật reqest headers
  app.use(compression()); // nén reponse http giảm băng thông
  app.use(cookieParser()); // cookies
  app.useGlobalPipes(new ValidationPipe()); // xác thực và chuyển đổi dữ liệu đầu vào
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    // cors
    origin: [],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  });

  // Cấu hình tài liệu Swagger
  const configSwagger = new DocumentBuilder()
    .setTitle('API Example') // Tiêu đề cho tài liệu API
    .setDescription('API description') // Mô tả tài liệu API
    .setVersion('1.0') // Phiên bản API
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('/api', app, document);

  // Listen port 9000
  await app.listen(9000);

  // Hot reload
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();


// client -> middleware -> guard -> intercaptor -> router handler -> intercaptor