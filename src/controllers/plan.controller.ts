import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PlanService } from '../services';
import { CreatePlanDto } from '../dto';
import { Plan } from '../models';

@ApiTags('plans')
@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @ApiOperation({ summary: 'Purchase an insurance plan' })
  @ApiBody({
    type: CreatePlanDto,
    description: 'Plan purchase details',
    examples: {
      example1: {
        summary: 'Purchase Health Insurance',
        value: {
          userId: 1,
          productId: 1,
          quantity: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Plan purchased successfully',
    schema: {
      example: {
        status: true,
        message: 'Request successful',
        data: {
          id: 1,
          userId: 1,
          productId: 1,
          quantity: 1,
          totalAmount: '10000.00',
          description: 'Optimal care mini x1',
          user: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            walletBalance: '90000.00',
          },
          product: {
            id: 1,
            name: 'Optimal care mini',
            price: '10000.00',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Insufficient wallet balance or invalid request',
    schema: {
      example: {
        status: false,
        message: 'Insufficient wallet balance',
        data: null,
      },
    },
  })
  async createPlan(@Body() createPlanDto: CreatePlanDto): Promise<Plan> {
    return this.planService.createPlan(createPlanDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get plan details by ID' })
  @ApiParam({ name: 'id', description: 'Plan ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Plan details retrieved successfully',
    schema: {
      example: {
        status: true,
        message: 'Request successful',
        data: {
          id: 1,
          userId: 1,
          productId: 1,
          quantity: 1,
          totalAmount: '10000.00',
          description: 'Optimal care mini x1',
          user: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
          },
          product: {
            id: 1,
            name: 'Optimal care mini',
            price: '10000.00',
          },
          pendingPolicies: [],
        },
      },
    },
  })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Plan | null> {
    return this.planService.findById(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all plans for a specific user' })
  @ApiParam({ name: 'userId', description: 'User ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'User plans retrieved successfully',
    schema: {
      example: {
        status: true,
        message: 'Request successful',
        data: [
          {
            id: 1,
            userId: 1,
            productId: 1,
            quantity: 1,
            totalAmount: '10000.00',
            description: 'Optimal care mini x1',
          },
        ],
      },
    },
  })
  async findByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Plan[]> {
    return this.planService.findByUserId(userId);
  }
}
