import { Controller, Post, Get, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { PolicyService } from '../services';
import { ActivatePolicyDto } from '../dto';
import { Policy } from '../models';

@ApiTags('policies')
@Controller('policies')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Post('activate/:pendingPolicyId')
  @ApiOperation({ summary: 'Activate a pending policy' })
  @ApiParam({ name: 'pendingPolicyId', description: 'Pending Policy ID', type: 'number' })
  @ApiBody({
    type: ActivatePolicyDto,
    description: 'Policy activation details',
    examples: {
      example1: {
        summary: 'Activate Policy',
        value: {
          userId: 1
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Policy activated successfully',
    schema: {
      example: {
        status: true,
        message: 'Request successful',
        data: {
          id: 1,
          policyNumber: 'POL-1735747200000-1234',
          userId: 1,
          productId: 1,
          pendingPolicyId: 1,
          createdAt: '2025-01-01T12:00:00.000Z',
          updatedAt: '2025-01-01T12:00:00.000Z'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid pending policy or activation failed',
    schema: {
      example: {
        status: false,
        message: 'Pending policy not found or already activated',
        data: null
      }
    }
  })
  async activatePolicy(
    @Param('pendingPolicyId', ParseIntPipe) pendingPolicyId: number,
    @Body() activatePolicyDto: ActivatePolicyDto,
  ): Promise<Policy> {
    return this.policyService.activatePolicy(pendingPolicyId, activatePolicyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active policies' })
  @ApiQuery({ name: 'planId', description: 'Filter by plan ID', required: false, type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of active policies',
    schema: {
      example: {
        status: true,
        message: 'Request successful',
        data: [
          {
            id: 1,
            policyNumber: 'POL-1735747200000-1234',
            userId: 1,
            productId: 1,
            pendingPolicyId: 1,
            createdAt: '2025-01-01T12:00:00.000Z',
            updatedAt: '2025-01-01T12:00:00.000Z'
          }
        ]
      }
    }
  })
  async findAll(@Query('planId') planId?: string): Promise<Policy[]> {
    const planIdNumber = planId ? parseInt(planId, 10) : undefined;
    return this.policyService.findAll(planIdNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get policy details by ID' })
  @ApiParam({ name: 'id', description: 'Policy ID', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Policy details retrieved successfully',
    schema: {
      example: {
        status: true,
        message: 'Request successful',
        data: {
          id: 1,
          policyNumber: 'POL-1735747200000-1234',
          userId: 1,
          productId: 1,
          pendingPolicyId: 1,
          createdAt: '2025-01-01T12:00:00.000Z',
          updatedAt: '2025-01-01T12:00:00.000Z'
        }
      }
    }
  })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Policy> {
    return this.policyService.findById(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all policies for a specific user' })
  @ApiParam({ name: 'userId', description: 'User ID', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'User policies retrieved successfully',
    schema: {
      example: {
        status: true,
        message: 'Request successful',
        data: [
          {
            id: 1,
            policyNumber: 'POL-1735747200000-1234',
            userId: 1,
            productId: 1,
            pendingPolicyId: 1,
            createdAt: '2025-01-01T12:00:00.000Z',
            updatedAt: '2025-01-01T12:00:00.000Z'
          }
        ]
      }
    }
  })
  async findByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<Policy[]> {
    return this.policyService.findByUserId(userId);
  }

  @Post('test-create')
  async testCreatePolicy() {
    try {
      const policyNumber = `POL-${Date.now()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      const result = await this.policyService.testCreatePolicy({
        userId: 1,
        productId: 3,
        pendingPolicyId: 7,
        policyNumber: policyNumber,
      });
      return result;
    } catch (error) {
      return { error: error.message, stack: error.stack };
    }
  }
} 