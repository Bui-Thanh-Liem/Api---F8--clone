declare const module: any;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
