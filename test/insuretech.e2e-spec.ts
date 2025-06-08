import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Sequelize } from 'sequelize-typescript';

describe('Insuretech API (e2e)', () => {
  let app: INestApplication;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    sequelize = moduleFixture.get<Sequelize>(Sequelize);

    await app.init();

    // Wait for database to be ready and seeded
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/products (GET)', () => {
    it('should return all products with categories', () => {
      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);

          const product = res.body[0];
          expect(product).toHaveProperty('id');
          expect(product).toHaveProperty('name');
          expect(product).toHaveProperty('price');
          expect(product).toHaveProperty('category');
          expect(product.category).toHaveProperty('name');
        });
    });
  });

  describe('/products/:id (GET)', () => {
    it('should return a specific product', () => {
      return request(app.getHttpServer())
        .get('/products/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 1);
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('price');
          expect(res.body).toHaveProperty('category');
        });
    });
  });

  describe('/plans (POST)', () => {
    it('should create a plan and deduct from wallet', () => {
      const createPlanDto = {
        userId: 1,
        productId: 1,
        quantity: 2,
        description: 'Test plan purchase',
      };

      return request(app.getHttpServer())
        .post('/plans')
        .send(createPlanDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('userId', 1);
          expect(res.body).toHaveProperty('productId', 1);
          expect(res.body).toHaveProperty('quantity', 2);
          expect(res.body).toHaveProperty('totalAmount');
          expect(res.body).toHaveProperty('pendingPolicies');
          expect(res.body.pendingPolicies).toHaveLength(2);
        });
    });

    it('should return 400 for insufficient wallet balance', () => {
      const createPlanDto = {
        userId: 3, // User with 75,000 balance
        productId: 2, // Optimal care standard (20,000 each)
        quantity: 4, // Total: 80,000 (more than balance after previous purchases)
        description: 'Test insufficient balance',
      };

      return request(app.getHttpServer())
        .post('/plans')
        .send(createPlanDto)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('Insufficient wallet balance');
        });
    });

    it('should return 404 for non-existent user', () => {
      const createPlanDto = {
        userId: 999,
        productId: 1,
        quantity: 1,
      };

      return request(app.getHttpServer())
        .post('/plans')
        .send(createPlanDto)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('User not found');
        });
    });
  });

  describe('/pending-policies/plan/:planId (GET)', () => {
    let planId: number;

    beforeAll(async () => {
      // Create a plan first
      const createPlanDto = {
        userId: 2,
        productId: 3, // Third-party auto insurance
        quantity: 3,
        description: 'Test plan for pending policies',
      };

      const response = await request(app.getHttpServer())
        .post('/plans')
        .send(createPlanDto);

      planId = response.body.id;
    });

    it('should return pending policies for a plan', () => {
      return request(app.getHttpServer())
        .get(`/pending-policies/plan/${planId}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body).toHaveLength(3);

          const pendingPolicy = res.body[0];
          expect(pendingPolicy).toHaveProperty('id');
          expect(pendingPolicy).toHaveProperty('planId', planId);
          expect(pendingPolicy).toHaveProperty('status', 'unused');
          expect(pendingPolicy).toHaveProperty('plan');
        });
    });
  });

  describe('/policies/activate/:pendingPolicyId (POST)', () => {
    let pendingPolicyId: number;

    beforeAll(async () => {
      // Create a plan and get a pending policy
      const createPlanDto = {
        userId: 1,
        productId: 4, // Comprehensive auto insurance
        quantity: 1,
        description: 'Test plan for policy activation',
      };

      const planResponse = await request(app.getHttpServer())
        .post('/plans')
        .send(createPlanDto);

      const pendingPoliciesResponse = await request(app.getHttpServer()).get(
        `/pending-policies/plan/${planResponse.body.id}`,
      );

      pendingPolicyId = pendingPoliciesResponse.body[0].id;
    });

    it('should activate a pending policy', () => {
      const activatePolicyDto = {
        userId: 1,
        description: 'Activated comprehensive auto policy',
      };

      return request(app.getHttpServer())
        .post(`/policies/activate/${pendingPolicyId}`)
        .send(activatePolicyDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('policyNumber');
          expect(res.body).toHaveProperty('userId', 1);
          expect(res.body).toHaveProperty('user');
          expect(res.body).toHaveProperty('product');
          expect(res.body.policyNumber).toMatch(/^POL-\d+-\d+$/);
        });
    });

    it('should return 409 if user already has policy for product', () => {
      const activatePolicyDto = {
        userId: 1,
        description: 'Duplicate policy attempt',
      };

      return request(app.getHttpServer())
        .post(`/policies/activate/${pendingPolicyId}`)
        .send(activatePolicyDto)
        .expect(409)
        .expect((res) => {
          expect(res.body.message).toContain(
            'User already has a policy for this product',
          );
        });
    });
  });

  describe('/policies (GET)', () => {
    it('should return all activated policies', () => {
      return request(app.getHttpServer())
        .get('/policies')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);

          if (res.body.length > 0) {
            const policy = res.body[0];
            expect(policy).toHaveProperty('id');
            expect(policy).toHaveProperty('policyNumber');
            expect(policy).toHaveProperty('user');
            expect(policy).toHaveProperty('product');
            expect(policy).toHaveProperty('plan');
          }
        });
    });

    it('should filter policies by plan', async () => {
      // First get a plan ID
      const plansResponse = await request(app.getHttpServer()).get(
        '/plans/user/1',
      );

      if (plansResponse.body.length > 0) {
        const planId = plansResponse.body[0].id;

        return request(app.getHttpServer())
          .get(`/policies?planId=${planId}`)
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);

            if (res.body.length > 0) {
              res.body.forEach((policy) => {
                expect(policy.planId).toBe(planId);
              });
            }
          });
      }
    });
  });
});
