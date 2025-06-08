import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerSetup = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('MyCoverGenius Insurance API')
    .setDescription(
      'A comprehensive insurance API for purchasing insurance products and managing policies',
    )
    .setVersion('1.0')
    .addTag('products', 'Insurance product management')
    .addTag('plans', 'Insurance plan purchase and management')
    .addTag('pending-policies', 'Pending policy management')
    .addTag('policies', 'Active policy management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};
