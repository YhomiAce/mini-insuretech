import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Policy, PendingPolicy, Plan, Product, User, PendingPolicyStatus } from '../models';
import { ActivatePolicyDto } from '../dto';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';

@Injectable()
export class PolicyService {
  constructor(
    @InjectModel(Policy)
    private policyModel: typeof Policy,
    @InjectModel(PendingPolicy)
    private pendingPolicyModel: typeof PendingPolicy,
    @InjectModel(Plan)
    private planModel: typeof Plan,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Product)
    private productModel: typeof Product,
    private sequelize: Sequelize,
  ) {}

  async activatePolicy(pendingPolicyId: number, activatePolicyDto: ActivatePolicyDto): Promise<Policy> {
    const { userId } = activatePolicyDto;

    try {
      // Find pending policy
      const pendingPolicy = await this.pendingPolicyModel.findByPk(pendingPolicyId);

      if (!pendingPolicy) {
        throw new NotFoundException('Pending policy not found');
      }

      if (pendingPolicy.status === PendingPolicyStatus.USED) {
        throw new BadRequestException('Pending policy has already been used');
      }

      // Get the plan separately
      const planId = (pendingPolicy as any).dataValues?.planId || pendingPolicy.planId;
      const plan = await this.planModel.findByPk(planId);

      if (!plan) {
        throw new NotFoundException('Plan not found for pending policy');
      }

      // Verify user exists
      const user = await this.userModel.findByPk(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Check if user already has a policy for this product
      const productId = (plan as any).dataValues?.productId || plan.productId;
      if (!productId) {
        throw new BadRequestException('Invalid plan - missing product information');
      }

      const existingPolicy = await this.policyModel.findOne({
        where: {
          userId,
          productId,
        },
      });

      if (existingPolicy) {
        throw new ConflictException('User already has a policy for this product');
      }

      // Create policy
      const policyNumber = `POL-${Date.now()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      let policy;
      try {
        policy = await this.policyModel.create(
          {
            userId,
            productId,
            pendingPolicyId: pendingPolicyId,
            policyNumber: policyNumber,
          } as any
        );
      } catch (createError) {
        console.error('Policy creation error:', createError);
        throw new BadRequestException(`Failed to create policy: ${createError.message}`);
      }

      // Update pending policy status and soft delete
      await pendingPolicy.update(
        { status: PendingPolicyStatus.USED }
      );
      await pendingPolicy.destroy();

      // Return the created policy with basic information
      return {
        ...policy.toJSON(),
        user: { id: userId },
        product: { id: productId },
        pendingPolicy: { id: pendingPolicyId, planId: plan.id }
      } as any;
    } catch (error) {
      throw error;
    }
  }

  async findAll(planId?: number): Promise<Policy[]> {
    const whereClause = planId ? { planId } : {};

    return this.policyModel.findAll({
      where: whereClause,
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
          model: Plan,
          as: 'plan',
        },
      ],
    });
  }

  async findById(id: number): Promise<Policy> {
    const policy = await this.policyModel.findByPk(id, {
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
          model: Plan,
          as: 'plan',
        },
      ],
    });

    if (!policy) {
      throw new NotFoundException('Policy not found');
    }

    return policy;
  }

  async findByUserId(userId: number): Promise<Policy[]> {
    return this.policyModel.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: 'product',
        },
        {
          model: Plan,
          as: 'plan',
        },
      ],
    });
  }

  async testCreatePolicy(data: any): Promise<any> {
    try {
      const policy = await this.policyModel.create(data);
      return policy.toJSON();
    } catch (error) {
      throw new Error(`Policy creation failed: ${error.message}`);
    }
  }
} 