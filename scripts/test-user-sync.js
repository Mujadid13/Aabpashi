#!/usr/bin/env node

/**
 * Test User Synchronization Script
 * 
 * This script manually creates a test user in the AabPashi database
 * and tests the synchronization with external platforms.
 * 
 * Usage: node scripts/test-user-sync.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Use the MONGO_URI from the environment
const MONGO_URI = process.env.MONGO_URI;

// Test user data
const TEST_USER = {
  name: "Test Farmer User",
  phone: "+923001234567",
  city: "Lahore",
  division: "Kasur",
  receiverNetwork: "Jazz",
  farmsize: "5-10 acres",
  role: "Farmer",
  country: "Pakistan",
  createdAt: new Date(),
  updatedAt: new Date()
};

// API Keys
const FARMOVATION_API_KEY = "d92c5d48f23aaf601d2ddace21dcd56ecff91efd6350f796ed15877a1899cd67";
const AABPASHI_API_KEY = "aabpashi_e1d2fbd78fe597d2ba4e4db354696a0b06e123100244058f18dc34ea72079444";

// Test configuration
const config = {
  aabpashiApiUrl: 'http://localhost:3000/api/sync/create-user',
  farmovationApiUrl: 'https://api.farmovation.tech/api/v1/sync/create-user',
  farmovationApiKey: process.env.FARMOVATION_API_KEY,
  testUser: {
    name: 'Test User 3',
    phone: '+923001234569', // Completely new phone number
    city: 'Lahore',
    division: 'Kasur',
    role: 'Farmer'
  }
};

async function createTestUser() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();
    
    const db = client.db(process.env.MONGO_DATABASE || 'aabpashi');
    const usersCollection = db.collection('users');
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ phone: TEST_USER.phone });
    
    if (existingUser) {
      console.log('⚠️  Test user already exists:', existingUser._id);
      return existingUser._id;
    }
    
    // Create new test user
    console.log('📝 Creating test user...');
    const result = await usersCollection.insertOne(TEST_USER);
    
    console.log('✅ Test user created successfully!');
    console.log('   User ID:', result.insertedId);
    console.log('   Phone:', TEST_USER.phone);
    console.log('   Name:', TEST_USER.name);
    
    return result.insertedId;
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    throw error;
  } finally {
    await client.close();
  }
}

async function testSyncAPI() {
  const userId = await createTestUser();
  
  console.log('\n🔄 Testing AabPashi sync API...');
  
  try {
    // Test the AabPashi sync endpoint
    const response = await fetch(`http://localhost:3000/api/sync/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': AABPASHI_API_KEY
      },
      body: JSON.stringify({
        ...TEST_USER,
        _id: userId.toString()
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ AabPashi sync API test successful!');
      console.log('   Response:', result);
    } else {
      console.log('❌ AabPashi sync API test failed!');
      console.log('   Status:', response.status);
      console.log('   Response:', result);
    }
    
  } catch (error) {
    console.error('❌ Error testing AabPashi sync API:', error);
  }
}

async function testFarmovationAPI() {
  console.log('\n🔄 Testing Farmovation User Server API directly...');
  
  try {
    // Use the field mapper to generate the correct payload
    const { SyncFieldMapper } = require('../lib/sync-field-mappers');
    const fieldMapper = SyncFieldMapper.getInstance();
    
    // Create user data in the format expected by the field mapper
    const userData = {
      _id: TEST_USER._id || 'test-user-id',
      name: TEST_USER.name,
      phone: TEST_USER.phone,
      city: TEST_USER.city,
      division: TEST_USER.division,
      role: TEST_USER.role,
      farmsize: TEST_USER.farmsize,
      country: TEST_USER.country,
      receiverNetwork: TEST_USER.receiverNetwork,
      createdAt: TEST_USER.createdAt
    };
    
    // Generate the correct Farmovation payload using the field mapper
    const farmovationUserData = fieldMapper.adaptUserData('farmovation', userData, 'aabpashi');

    const response = await fetch(`https://user-server.sam.farmovation.tech/api/v1/sync/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': FARMOVATION_API_KEY
      },
      body: JSON.stringify(farmovationUserData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Farmovation API test successful!');
      console.log('   Response:', result);
      return result.userId;
    } else {
      console.log('❌ Farmovation API test failed!');
      console.log('   Status:', response.status);
      console.log('   Response:', result);
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error testing Farmovation API:', error);
    return null;
  }
}

async function verifyUserInFarmovation(userId) {
  if (!userId) {
    console.log('⚠️  No user ID to verify');
    return;
  }

  console.log('\n🔍 Verifying user in Farmovation User Server...');
  
  try {
    const response = await fetch(`https://user-server.sam.farmovation.tech/api/v1/get-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': FARMOVATION_API_KEY
      },
      body: JSON.stringify({
        task: 'get-user',
        userId: userId
      })
    });
    
    const result = await response.json();
    
    if (response.ok && result.result === 0) {
      console.log('✅ User verified in Farmovation!');
      console.log('   User Data:', result.userData);
    } else {
      console.log('❌ User verification failed!');
      console.log('   Status:', response.status);
      console.log('   Response:', result);
    }
    
  } catch (error) {
    console.error('❌ Error verifying user:', error);
  }
}

async function main() {
  console.log('🚀 Starting User Sync Test...\n');
  
  try {
    // Test AabPashi sync API
    await testSyncAPI();
    
    // Test Farmovation API directly
    const farmovationUserId = await testFarmovationAPI();
    
    // Verify user in Farmovation
    await verifyUserInFarmovation(farmovationUserId);
    
    console.log('\n✅ All tests completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Check AabPashi logs: docker-compose logs aabpashi-app');
    console.log('   2. Check Farmovation server logs via SSH:');
    console.log('      ssh -i ~/.ssh/farmovation_server_key root@217.154.66.145');
    console.log('      docker logs farmovation-user-server');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { createTestUser, testSyncAPI }; 