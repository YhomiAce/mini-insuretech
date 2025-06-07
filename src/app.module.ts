import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DbModuleModule } from './config/db-module/db-module.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModuleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
