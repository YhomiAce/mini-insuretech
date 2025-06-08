import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  Policy,
  PendingPolicy,
  Plan,
  Product,
  User,
  PendingPolicyStatus,
} from '../models';
import { ActivatePolicyDto } from '../dto';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';

@Injectable()
export class PolicyService {
  private readonly logger = new Logger(PolicyService.name);
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

  async activatePolicy(
    pendingPolicyId: number,
    activatePolicyDto: ActivatePolicyDto,
  ): Promise<Policy> {
    const { userId } = activatePolicyDto;
    // Start transaction
    const transaction = await this.sequelize.transaction();
    try {
      // Find pending policy
      const pendingPolicy =
        await this.pendingPolicyModel.findByPk(pendingPolicyId);

      if (!pendingPolicy) {
        throw new NotFoundException('Pending policy not found');
      }

      if (pendingPolicy.status === PendingPolicyStatus.USED) {
        throw new BadRequestException('Pending policy has already been used');
      }

      // Get the plan separately
      const planId =
        (pendingPolicy as any).dataValues?.planId || pendingPolicy.planId;
      const plan = await this.planModel.findByPk(planId);

      if (!plan) {
        throw new NotFoundException('Plan not found for pending policy');
      }

      // Verify user exists
      const user = await this.userModel.findByPk(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.dataValues.id !== plan.dataValues.userId) {
        throw new BadRequestException('User does not have access to this plan');
      }

      // Check if user already has a policy for this product
      const productId = (plan as any).dataValues?.productId || plan.productId;
      if (!productId) {
        throw new BadRequestException(
          'Invalid plan - missing product information',
        );
      }

      const existingPolicy = await this.policyModel.findOne({
        where: {
          userId,
          productId,
        },
      });

      if (existingPolicy) {
        throw new ConflictException(
          'User already has a policy for this product',
        );
      }

      // Create policy
      const policyNumber = `POL-${Date.now()}-${Math.floor(
        Math.random() * 10000,
      )
        .toString()
        .padStart(4, '0')}`;
      let policy;
      policy = await this.policyModel.create(
        {
          userId,
          productId,
          pendingPolicyId,
          policyNumber,
          planId,
        } as Policy,
        { transaction },
      );

      // Update pending policy status and soft delete
      await pendingPolicy.update(
        { status: PendingPolicyStatus.USED },
        { transaction },
      );
      await pendingPolicy.destroy({ transaction });
      await transaction.commit();

      // Return the created policy with basic information
      return {
        ...policy.toJSON(),
        user: { id: userId },
        product: { id: productId },
        pendingPolicy: { id: pendingPolicyId, planId: plan.id },
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findAll(planId?: number): Promise<Policy[]> {
    try {
      const policies = await this.policyModel.findAll({
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
            where: planId ? { id: planId } : {},
          },
        ],
      });
      return policies;
    } catch (error) {
      this.logger.error('Error finding all policies', error);
      throw error;
    }
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

}
