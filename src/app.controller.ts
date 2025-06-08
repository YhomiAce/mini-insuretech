import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('general')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get API welcome message' })
  @ApiResponse({
    status: 200,
    description: 'Welcome message',
    schema: {
      example: {
        status: true,
        message: 'Request successful',
        data: 'Hello World!',
      },
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
