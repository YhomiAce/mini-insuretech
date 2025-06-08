import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PendingPolicy, Plan, Product, PendingPolicyStatus } from '../models';

@Injectable()
export class PendingPolicyService {
  constructor(
    @InjectModel(PendingPolicy)
    private pendingPolicyModel: typeof PendingPolicy,
  ) {}

  async findByPlanId(planId: number): Promise<PendingPolicy[]> {
    return this.pendingPolicyModel.findAll({
      where: {
        planId,
        status: PendingPolicyStatus.UNUSED, // Only show unused pending policies
      },
      include: [
        {
          model: Plan,
          as: 'plan',
          include: [
            {
              model: Product,
              as: 'product',
            },
          ],
        },
      ],
    });
  }

  async findById(id: number): Promise<PendingPolicy> {
    const pendingPolicy = await this.pendingPolicyModel.findByPk(id, {
      include: [
        {
          model: Plan,
          as: 'plan',
          include: [
            {
              model: Product,
              as: 'product',
            },
          ],
        },
      ],
    });

    if (!pendingPolicy) {
      throw new NotFoundException('Pending policy not found');
    }

    return pendingPolicy;
  }
}
