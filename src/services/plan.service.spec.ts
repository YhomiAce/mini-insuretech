import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { PlanService } from './plan.service';
import {
  Plan,
  Product,
  User,
  PendingPolicy,
} from '../models';
import { CreatePlanDto } from '../dto';

describe('PlanService', () => {
  let service: PlanService;
  let mockTransaction: any;

  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    walletBalance: 100000,
    update: jest.fn(),
  };

  const mockProduct = {
    id: 1,
    name: 'Optimal care mini',
    price: 10000,
    description: 'Basic health insurance coverage',
    categoryId: 1,
  };

  const mockPlan = {
    id: 1,
    userId: 1,
    productId: 1,
    quantity: 2,
    totalAmount: 20000,
    description: 'Test plan',
  };

  const mockPlanModel = {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
  };

  const mockProductModel = {
    findByPk: jest.fn(),
  };

  const mockUserModel = {
    findByPk: jest.fn(),
  };

  const mockPendingPolicyModel = {
    bulkCreate: jest.fn(),
  };

  const mockSequelize = {
    transaction: jest.fn(),
  };

  beforeEach(async () => {
    mockTransaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanService,
        {
          provide: getModelToken(Plan),
          useValue: mockPlanModel,
        },
        {
          provide: getModelToken(Product),
          useValue: mockProductModel,
        },
        {
          provide: getModelToken(User),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(PendingPolicy),
          useValue: mockPendingPolicyModel,
        },
        {
          provide: Sequelize,
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get<PlanService>(PlanService);

    // Reset all mocks
    jest.clearAllMocks();
    mockSequelize.transaction.mockResolvedValue(mockTransaction);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPlan', () => {
    const createPlanDto: CreatePlanDto = {
      userId: 1,
      productId: 1,
      quantity: 2,
      description: 'Test plan',
    };

    it('should create a plan successfully', async () => {
      mockUserModel.findByPk.mockResolvedValue(mockUser);
      mockProductModel.findByPk.mockResolvedValue(mockProduct);
      mockPlanModel.create.mockResolvedValue(mockPlan);
      mockPlanModel.findByPk.mockResolvedValue(mockPlan);
      mockPendingPolicyModel.bulkCreate.mockResolvedValue([]);

      const result = await service.createPlan(createPlanDto);

      expect(result).toEqual(mockPlan);
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(mockUser.update).toHaveBeenCalledWith(
        { walletBalance: 80000 },
        { transaction: mockTransaction },
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findByPk.mockResolvedValue(null);

      await expect(service.createPlan(createPlanDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should throw NotFoundException if product not found', async () => {
      mockUserModel.findByPk.mockResolvedValue(mockUser);
      mockProductModel.findByPk.mockResolvedValue(null);

      await expect(service.createPlan(createPlanDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should throw BadRequestException if insufficient wallet balance', async () => {
      const poorUser = { ...mockUser, walletBalance: 5000 };
      mockUserModel.findByPk.mockResolvedValue(poorUser);
      mockProductModel.findByPk.mockResolvedValue(mockProduct);

      await expect(service.createPlan(createPlanDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });
});
