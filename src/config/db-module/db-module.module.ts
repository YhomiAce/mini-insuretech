import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  ProductCategory,
  Product,
  User,
  Plan,
  PendingPolicy,
  Policy,
} from '../../models';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DB_HOST') || 'localhost',
        port: configService.get('DB_PORT') || 5432,
        username: configService.get('DB_USER') || 'root',
        password: configService.get('DB_PASSWORD') || 'secret',
        database: configService.get('DB_NAME') || 'insuretech',
        models: [ProductCategory, Product, User, Plan, PendingPolicy, Policy],
        autoLoadModels: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DbModuleModule {}
