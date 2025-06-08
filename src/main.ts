import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor, HttpExceptionFilter } from './common';
import { swaggerSetup } from './docs/swagger-setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure Swagger
  swaggerSetup(app);

  // Apply global interceptor and filter
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
