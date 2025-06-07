import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor, HttpExceptionFilter } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('MyCoverGenius Insurance API')
    .setDescription('A comprehensive insurance API for purchasing insurance products and managing policies')
    .setVersion('1.0')
    .addTag('products', 'Insurance product management')
    .addTag('plans', 'Insurance plan purchase and management')
    .addTag('pending-policies', 'Pending policy management')
    .addTag('policies', 'Active policy management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Apply global interceptor and filter
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
