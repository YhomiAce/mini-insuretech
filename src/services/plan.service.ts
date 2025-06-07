import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Plan, Product, User, PendingPolicy, PendingPolicyStatus } from '../models';
import { CreatePlanDto } from '../dto';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class PlanService {
  constructor(
    @InjectModel(Plan)
    private planModel: typeof Plan,
    @InjectModel(Product)
    private productModel: typeof Product,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(PendingPolicy)
    private pendingPolicyModel: typeof PendingPolicy,
    private sequelize: Sequelize,
  ) {}

  async createPlan(createPlanDto: CreatePlanDto): Promise<Plan> {
    const { userId, productId, quantity, description } = createPlanDto;

    // Start transaction
    const transaction = await this.sequelize.transaction();

    try {
      // Find user and product
      const user = await this.userModel.findByPk(userId);
      const product = await this.productModel.findByPk(productId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      // Calculate total amount
      const productPrice = parseFloat(
        (product as any).dataValues?.price || 
        product.price || 
        '0'
      );
      const userBalance = parseFloat(
        (user as any).dataValues?.walletBalance || 
        user.walletBalance || 
        '0'
      );
      const totalAmount = productPrice * quantity;

      // Check if user has sufficient wallet balance
      if (userBalance < totalAmount) {
        throw new BadRequestException(`Insufficient wallet balance. Required: ${totalAmount}, Available: ${userBalance}`);
      }

      // Deduct from user's wallet
      await user.update(
        { walletBalance: userBalance - totalAmount },
        { transaction }
      );

      // Create plan
      const plan = await this.planModel.create(
        {
          userId,
          productId,
          quantity,
          totalAmount,
          description: description || '',
        } as any,
        { transaction }
      );

      // Create pending policies (slots)
      const pendingPolicies: Array<any> = [];
      for (let i = 0; i < quantity; i++) {
        pendingPolicies.push({
          planId: plan.id,
          status: PendingPolicyStatus.UNUSED,
        });
      }

      await this.pendingPolicyModel.bulkCreate(pendingPolicies, { transaction });

      await transaction.commit();

      const result = await this.findById(plan.id);
      if (!result) {
        throw new NotFoundException('Plan not found after creation');
      }
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findById(id: number): Promise<Plan | null> {
    return this.planModel.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
        },
        {
          model: Product,
          as: 'product',
        },
        {
          model: PendingPolicy,
          as: 'pendingPolicies',
        },
      ],
    });
  }

  async findByUserId(userId: number): Promise<Plan[]> {
    return this.planModel.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: 'product',
        },
        {
          model: PendingPolicy,
          as: 'pendingPolicies',
        },
      ],
    });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async findProductById(id: number): Promise<Product | null> {
    return this.productModel.findByPk(id);
  }
} 