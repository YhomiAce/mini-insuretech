# MyCoverGenius Insuretech API

A comprehensive mini insuretech API built with NestJS, Sequelize-TypeScript, and PostgreSQL that allows users to purchase insurance products using their wallet and activate policies.

## 🏗️ Architecture Overview

This API implements a complete insurance management system with the following entities:

- **Product Categories**: Health and Auto insurance categories
- **Products**: Specific insurance products with pricing
- **Users**: System users with wallet functionality
- **Plans**: Purchased product plans with quantity and total amount
- **Pending Policies**: Slots created when plans are purchased
- **Policies**: Activated pending policies with unique policy numbers

## 📋 Features

### Core Functionality
1. **Product Management**: Fetch insurance products with categories and pricing
2. **Plan Purchase**: Buy insurance plans with automatic wallet deduction
3. **Pending Policy Management**: View unused policy slots under plans
4. **Policy Activation**: Convert pending policies to active policies
5. **Policy Management**: View and filter activated policies

### Business Rules
- Users can only have one policy per product type
- Wallet balance is automatically deducted during plan purchase
- Pending policies are soft-deleted when activated
- Each policy gets a unique auto-generated policy number
- Comprehensive transaction management ensures data consistency

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Yarn package manager
- Docker and Docker Compose
- PostgreSQL (via Docker)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd insuretech
```

2. **Install dependencies**
```bash
yarn install
```

3. **Start the database**
```bash
docker-compose up -d
```

4. **Start the application**
```bash
# Development mode with hot reload
yarn start:dev

# Production mode
yarn start:prod
```

The API will be available at `http://localhost:3000`

### Database Setup

The application automatically:
- Creates database tables using Sequelize synchronization
- Seeds initial data including:
  - Product categories (Health, Auto)
  - Insurance products with pricing
  - Test users with wallet balances

## 📊 Database Schema

### Products Available
| Product | Category | Price (₦) |
|---------|----------|-----------|
| Optimal care mini | Health | 10,000 |
| Optimal care standard | Health | 20,000 |
| Third-party | Auto | 5,000 |
| Comprehensive | Auto | 15,000 |

### Test Users
| ID | Name | Email | Wallet Balance (₦) |
|----|------|-------|-------------------|
| 1 | John Doe | john.doe@example.com | 100,000 |
| 2 | Jane Smith | jane.smith@example.com | 150,000 |
| 3 | Bob Johnson | bob.johnson@example.com | 75,000 |

## 🔌 API Endpoints

### Products

#### Get All Products
```http
GET /products
```
**Response**: Array of products with categories and pricing

#### Get Product by ID
```http
GET /products/:id
```
**Response**: Single product with category details

### Plans

#### Purchase a Plan
```http
POST /plans
Content-Type: application/json

{
  "userId": 1,
  "productId": 1,
  "quantity": 2,
  "description": "Health insurance plan"
}
```
**Response**: Created plan with pending policies

#### Get Plan by ID
```http
GET /plans/:id
```

#### Get User's Plans
```http
GET /plans/user/:userId
```

### Pending Policies

#### Get Pending Policies for a Plan
```http
GET /pending-policies/plan/:planId
```
**Response**: Array of unused pending policies

### Policies

#### Activate a Pending Policy
```http
POST /policies/activate/:pendingPolicyId
Content-Type: application/json

{
  "userId": 1,
  "description": "Activated health policy"
}
```
**Response**: Created policy with unique policy number

#### Get All Policies
```http
GET /policies
```

#### Filter Policies by Plan
```http
GET /policies?planId=1
```

#### Get User's Policies
```http
GET /policies/user/:userId
```

## 🧪 Testing

### Run Unit Tests
```bash
yarn test
```

### Run Integration Tests
```bash
yarn test:e2e
```

### Run Tests with Coverage
```bash
yarn test:cov
```

### Test Scenarios Covered
- Product retrieval and validation
- Plan creation with wallet deduction
- Insufficient balance handling
- Pending policy management
- Policy activation with business rule validation
- Duplicate policy prevention
- Transaction rollback on errors

## 📝 API Usage Examples

### Example 1: Purchase a Health Insurance Plan

```bash
# 1. Get available products
curl -X GET http://localhost:3000/products

# 2. Purchase a plan (2 units of Optimal care mini)
curl -X POST http://localhost:3000/plans \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "productId": 1,
    "quantity": 2,
    "description": "Family health coverage"
  }'

# 3. Check pending policies
curl -X GET http://localhost:3000/pending-policies/plan/1

# 4. Activate a policy
curl -X POST http://localhost:3000/policies/activate/1 \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "description": "Primary health policy"
  }'
```

### Example 2: View All Policies

```bash
# Get all activated policies
curl -X GET http://localhost:3000/policies

# Filter policies by plan
curl -X GET http://localhost:3000/policies?planId=1

# Get user's policies
curl -X GET http://localhost:3000/policies/user/1
```

## 🛠️ Development

### Project Structure
```
src/
├── controllers/          # API route handlers
├── services/            # Business logic
├── models/              # Database models
├── dto/                 # Data transfer objects
├── seeders/             # Database seeders
├── config/              # Configuration modules
└── insuretech/          # Main module organization
```

### Key Technologies
- **NestJS**: Progressive Node.js framework
- **Sequelize-TypeScript**: ORM with TypeScript support
- **PostgreSQL**: Relational database
- **Class-validator**: DTO validation
- **Jest**: Testing framework

### Database Relationships
- Users → Plans (One-to-Many)
- Products → Plans (One-to-Many)
- Plans → Pending Policies (One-to-Many)
- Users → Policies (One-to-Many)
- Products → Policies (One-to-Many)
- Plans → Policies (One-to-Many)

## 🔒 Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid input data or insufficient wallet balance
- **404 Not Found**: Resource not found (user, product, policy)
- **409 Conflict**: Business rule violations (duplicate policies)
- **500 Internal Server Error**: Unexpected server errors

## 🚀 Deployment

### Environment Variables
Create a `.env` file with:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=root
DB_PASSWORD=secret
DB_NAME=insuretech
```

### Production Deployment
1. Build the application: `yarn build`
2. Set up PostgreSQL database
3. Configure environment variables
4. Run: `yarn start:prod`

## 📈 Performance Considerations

- Database transactions ensure data consistency
- Soft deletes for pending policies maintain audit trail
- Indexed foreign keys for optimal query performance
- Connection pooling for database efficiency

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For questions or support, please contact:
- Email: [Your Email]
- Phone: 08160161074

---

**Built with ❤️ for MyCoverGenius Backend Engineer Assessment**
