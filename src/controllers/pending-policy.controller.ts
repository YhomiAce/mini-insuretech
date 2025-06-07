import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PendingPolicyService } from '../services';
import { PendingPolicy } from '../models';

@ApiTags('pending-policies')
@Controller('pending-policies')
export class PendingPolicyController {
  constructor(private readonly pendingPolicyService: PendingPolicyService) {}

  @Get('plan/:planId')
  @ApiOperation({ summary: 'Get all pending policies for a specific plan' })
  @ApiParam({ name: 'planId', description: 'Plan ID', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of pending policies for the plan',
    schema: {
      example: {
        status: true,
        message: 'Request successful',
        data: [
          {
            id: 1,
            planId: 1,
            status: 'unused',
            description: null,
            createdAt: '2025-01-01T12:00:00.000Z',
            updatedAt: '2025-01-01T12:00:00.000Z',
            deletedAt: null
          }
        ]
      }
    }
  })
  async findByPlanId(@Param('planId', ParseIntPipe) planId: number): Promise<PendingPolicy[]> {
    return this.pendingPolicyService.findByPlanId(planId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pending policy details by ID' })
  @ApiParam({ name: 'id', description: 'Pending Policy ID', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Pending policy details retrieved successfully',
    schema: {
      example: {
        status: true,
        message: 'Request successful',
        data: {
          id: 1,
          planId: 1,
          status: 'unused',
          description: null,
          createdAt: '2025-01-01T12:00:00.000Z',
          updatedAt: '2025-01-01T12:00:00.000Z',
          deletedAt: null
        }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Pending policy not found',
    schema: {
      example: {
        status: false,
        message: 'Pending policy not found',
        data: null
      }
    }
  })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<PendingPolicy> {
    return this.pendingPolicyService.findById(id);
  }
} 