import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product, ProductCategory } from '../models';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.findAll({
      include: [
        {
          model: ProductCategory,
          as: 'category',
        },
      ],
    });
  }

  async findById(id: number): Promise<Product | null> {
    return this.productModel.findByPk(id, {
      include: [
        {
          model: ProductCategory,
          as: 'category',
        },
      ],
    });
  }
}
