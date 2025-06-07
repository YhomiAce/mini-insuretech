import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProductService } from '../services';
import { Product } from '../models';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all insurance products' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all insurance products with their categories',
    schema: {
      example: {
        status: true,
        message: 'Request successful',
        data: [
          {
            id: 1,
            name: 'Optimal care mini',
            price: '10000.00',
            description: 'Basic health insurance coverage',
            categoryId: 1,
            category: {
              id: 1,
              name: 'Health',
              description: 'Health insurance products'
            }
          }
        ]
      }
    }
  })
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific insurance product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Insurance product details',
    schema: {
      example: {
        status: true,
        message: 'Request successful',
        data: {
          id: 1,
          name: 'Optimal care mini',
          price: '10000.00',
          description: 'Basic health insurance coverage',
          categoryId: 1,
          category: {
            id: 1,
            name: 'Health',
            description: 'Health insurance products'
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Product not found',
    schema: {
      example: {
        status: false,
        message: 'Product not found',
        data: null
      }
    }
  })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Product | null> {
    return this.productService.findById(id);
  }
} 