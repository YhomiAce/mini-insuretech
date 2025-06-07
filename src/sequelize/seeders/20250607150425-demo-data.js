'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert product categories
    await queryInterface.bulkInsert('product_categories', [
      {
        id: 1,
        name: 'Health',
        description: 'Health insurance products',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Auto',
        description: 'Auto insurance products',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert products
    await queryInterface.bulkInsert('products', [
      {
        id: 1,
        name: 'Optimal care mini',
        price: 10000.00,
        description: 'Basic health insurance coverage',
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Optimal care standard',
        price: 20000.00,
        description: 'Standard health insurance coverage',
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Third-party',
        price: 5000.00,
        description: 'Third-party auto insurance',
        categoryId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: 'Comprehensive',
        price: 15000.00,
        description: 'Comprehensive auto insurance',
        categoryId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert users with wallet balances
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        walletBalance: 100000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        walletBalance: 150000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        walletBalance: 75000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('product_categories', null, {});
  }
};
