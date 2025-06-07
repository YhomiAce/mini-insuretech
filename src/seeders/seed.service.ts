import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductCategory, Product, User } from '../models';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(ProductCategory)
    private productCategoryModel: typeof ProductCategory,
    @InjectModel(Product)
    private productModel: typeof Product,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async onModuleInit() {
    await this.seedData();
  }

  private async seedData() {
    try {
      // Check if data already exists
      const existingCategories = await this.productCategoryModel.count();
      if (existingCategories > 0) {
        console.log('Database already seeded');
        return;
      }

      // Create product categories
      const healthCategory = await this.productCategoryModel.create({
        name: 'Health',
        description: 'Health insurance products',
      } as any);

      const autoCategory = await this.productCategoryModel.create({
        name: 'Auto',
        description: 'Auto insurance products',
      } as any);

      // Create health products
      await this.productModel.create({
        name: 'Optimal care mini',
        price: 10000,
        description: 'Basic health insurance coverage',
        categoryId: healthCategory.id,
      } as any);

      await this.productModel.create({
        name: 'Optimal care standard',
        price: 20000,
        description: 'Standard health insurance coverage',
        categoryId: healthCategory.id,
      } as any);

      // Create auto products
      await this.productModel.create({
        name: 'Third-party',
        price: 5000,
        description: 'Third-party auto insurance',
        categoryId: autoCategory.id,
      } as any);

      await this.productModel.create({
        name: 'Comprehensive',
        price: 15000,
        description: 'Comprehensive auto insurance',
        categoryId: autoCategory.id,
      } as any);

      // Create test users with wallet balance
      await this.userModel.create({
        name: 'John Doe',
        email: 'john.doe@example.com',
        walletBalance: 100000, // 100,000 naira
      } as any);

      await this.userModel.create({
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        walletBalance: 150000, // 150,000 naira
      } as any);

      await this.userModel.create({
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        walletBalance: 75000, // 75,000 naira
      } as any);

      console.log('Database seeded successfully');
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }
} 