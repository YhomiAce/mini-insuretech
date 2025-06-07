import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductCategory, Product, User, Plan, PendingPolicy, Policy } from '../models';
import { ProductService, PlanService, PendingPolicyService, PolicyService } from '../services';
import { ProductController, PlanController, PendingPolicyController, PolicyController } from '../controllers';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProductCategory,
      Product,
      User,
      Plan,
      PendingPolicy,
      Policy,
    ]),
  ],
  controllers: [
    ProductController,
    PlanController,
    PendingPolicyController,
    PolicyController,
  ],
  providers: [
    ProductService,
    PlanService,
    PendingPolicyService,
    PolicyService,
  ],
  exports: [
    ProductService,
    PlanService,
    PendingPolicyService,
    PolicyService,
  ],
})
export class InsurtechModule {} 