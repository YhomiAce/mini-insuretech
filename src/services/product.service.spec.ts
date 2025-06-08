import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ProductService } from './product.service';
import { Product, ProductCategory } from '../models';

describe('ProductService', () => {
  let service: ProductService;
  let productModel: typeof Product;

  const mockProduct = {
    id: 1,
    name: 'Optimal care mini',
    price: 10000,
    description: 'Basic health insurance coverage',
    categoryId: 1,
    category: {
      id: 1,
      name: 'Health',
      description: 'Health insurance products',
    },
  };

  const mockProductModel = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken(Product),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productModel = module.get<typeof Product>(getModelToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const expectedProducts = [mockProduct];
      mockProductModel.findAll.mockResolvedValue(expectedProducts);

      const result = await service.findAll();

      expect(result).toEqual(expectedProducts);
      expect(mockProductModel.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: ProductCategory,
            as: 'category',
          },
        ],
      });
    });
  });

  describe('findById', () => {
    it('should return a product by id', async () => {
      mockProductModel.findByPk.mockResolvedValue(mockProduct);

      const result = await service.findById(1);

      expect(result).toEqual(mockProduct);
      expect(mockProductModel.findByPk).toHaveBeenCalledWith(1, {
        include: [
          {
            model: ProductCategory,
            as: 'category',
          },
        ],
      });
    });
  });
});
