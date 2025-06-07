#!/bin/bash

echo "Testing MyCoverGenius Insuretech API"
echo "===================================="

# Wait for the application to start
echo "Waiting for application to start..."
sleep 10

# Test 1: Get all products
echo -e "\n1. Testing GET /products"
curl -X GET http://localhost:3000/products -H "Content-Type: application/json" | jq '.' || echo "Failed to get products"

# Test 2: Get a specific product
echo -e "\n2. Testing GET /products/1"
curl -X GET http://localhost:3000/products/1 -H "Content-Type: application/json" | jq '.' || echo "Failed to get product 1"

# Test 3: Purchase a plan
echo -e "\n3. Testing POST /plans (Purchase a plan)"
curl -X POST http://localhost:3000/plans \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "productId": 1,
    "quantity": 2,
    "description": "Test health insurance plan"
  }' | jq '.' || echo "Failed to create plan"

# Test 4: Get pending policies for the plan
echo -e "\n4. Testing GET /pending-policies/plan/1"
curl -X GET http://localhost:3000/pending-policies/plan/1 -H "Content-Type: application/json" | jq '.' || echo "Failed to get pending policies"

# Test 5: Activate a policy
echo -e "\n5. Testing POST /policies/activate/1"
curl -X POST http://localhost:3000/policies/activate/1 \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "description": "Activated health policy"
  }' | jq '.' || echo "Failed to activate policy"

# Test 6: Get all policies
echo -e "\n6. Testing GET /policies"
curl -X GET http://localhost:3000/policies -H "Content-Type: application/json" | jq '.' || echo "Failed to get policies"

echo -e "\n\nAPI testing completed!" 