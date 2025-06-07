import { IsNotEmpty, IsNumber, IsPositive, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanDto {
  @ApiProperty({ 
    description: 'User ID who is purchasing the plan',
    example: 1,
    type: 'number'
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ 
    description: 'Product ID to be purchased',
    example: 1,
    type: 'number'
  })
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty({ 
    description: 'Quantity of the product to purchase',
    example: 1,
    minimum: 1,
    type: 'number'
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({ 
    description: 'Optional description for the plan',
    example: 'Health insurance for family',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  description?: string;
} 