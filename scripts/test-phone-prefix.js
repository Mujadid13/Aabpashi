#!/usr/bin/env node

/**
 * Test Phone Prefix Field Mapping
 * 
 * This script tests the updated field mapping to ensure phone prefix
 * information is correctly included in the data sent to Farmovation.
 * 
 * Usage: node scripts/test-phone-prefix.js
 */

const { SyncFieldMapper } = require('../lib/sync-field-mappers');

// Test user data with different phone number formats
const testUsers = [
  {
    name: "Test User 1",
    phone: "+923001234567",
    city: "Lahore",
    division: "Kasur",
    role: "Farmer",
    farmsize: "5-10 acres",
    country: "Pakistan",
    receiverNetwork: "Jazz",
    _id: "test-user-1",
    createdAt: new Date()
  },
  {
    name: "Test User 2", 
    phone: "3001234568", // Without prefix
    city: "Karachi",
    division: "Sindh",
    role: "Agricultural Officer",
    farmsize: "10-25 acres",
    country: "Pakistan",
    receiverNetwork: "Telenor",
    _id: "test-user-2",
    createdAt: new Date()
  },
  {
    name: "Test User 3",
    phone: "+923001234569", // With prefix
    city: "Islamabad",
    division: "Punjab",
    role: "Researcher",
    farmsize: "1-5 acres",
    country: "Pakistan",
    receiverNetwork: "Ufone",
    _id: "test-user-3",
    createdAt: new Date()
  }
];

function testFieldMapping() {
  console.log('🧪 Testing Phone Prefix Field Mapping...');
  console.log('=====================================\n');

  const fieldMapper = SyncFieldMapper.getInstance();

  testUsers.forEach((userData, index) => {
    console.log(`📋 Test User ${index + 1}: ${userData.name}`);
    console.log(`   Phone: ${userData.phone}`);
    console.log(`   Network: ${userData.receiverNetwork}`);
    console.log('');

    // Test Farmovation User Server mapping
    console.log('🔍 Farmovation User Server Mapping:');
    const farmovationData = fieldMapper.adaptUserData('farmovation', userData, 'aabpashi');
    console.log('   userData:');
    console.log(`     email: ${farmovationData.userData.email}`);
    console.log(`     mobile: ${farmovationData.userData.mobile}`);
    console.log(`     phone: ${farmovationData.userData.phone}`);
    console.log(`     phone_prefix: ${farmovationData.userData.phone_prefix}`);
    console.log(`     mobile_operator: ${farmovationData.userData.mobile_operator}`);
    console.log(`     country_code: ${farmovationData.userData.country_code}`);
    console.log(`     first_name: ${farmovationData.userData.first_name}`);
    console.log(`     last_name: ${farmovationData.userData.last_name}`);
    console.log('');

    // Test Farmovation Marketplace mapping
    console.log('🔍 Farmovation Marketplace Mapping:');
    const marketplaceData = fieldMapper.adaptUserData('farmovation_marketplace', userData, 'aabpashi');
    console.log('   seller.profile:');
    console.log(`     phone: ${marketplaceData.seller.profile.phone}`);
    console.log(`     phone_prefix: ${marketplaceData.seller.profile.phone_prefix}`);
    console.log(`     mobile: ${marketplaceData.seller.profile.mobile}`);
    console.log(`     email: ${marketplaceData.seller.profile.email}`);
    console.log('');

    // Test Generic mapping
    console.log('🔍 Generic Platform Mapping:');
    const genericData = fieldMapper.adaptUserData('generic', userData, 'aabpashi');
    console.log('   user:');
    console.log(`     phone: ${genericData.user.phone}`);
    console.log(`     phone_prefix: ${genericData.user.phone_prefix}`);
    console.log(`     mobile: ${genericData.user.mobile}`);
    console.log(`     email: ${genericData.user.email}`);
    console.log('');

    console.log('─'.repeat(50));
    console.log('');
  });

  // Test phone prefix extraction logic
  console.log('🔍 Phone Prefix Extraction Logic Test:');
  const testPhones = [
    '+923001234567',
    '3001234568', 
    '+923001234569',
    '03001234570',
    '+923001234571'
  ];

  testPhones.forEach(phone => {
    const phoneWithPrefix = phone;
    const phoneWithoutPrefix = phone.replace(/[^0-9]/g, '');
    const phonePrefix = phoneWithPrefix.startsWith('+') ? phoneWithPrefix.substring(0, 3) : '+92';
    
    // Extract mobile number without country code
    let mobileNumber = phoneWithoutPrefix;
    if (phoneWithoutPrefix.startsWith('92') && phoneWithoutPrefix.length > 10) {
      mobileNumber = phoneWithoutPrefix.substring(2); // Remove 92 prefix
    }
    
    console.log(`   Input: ${phone}`);
    console.log(`   With Prefix: ${phoneWithPrefix}`);
    console.log(`   Without Prefix: ${phoneWithoutPrefix}`);
    console.log(`   Extracted Prefix: ${phonePrefix}`);
    console.log(`   Mobile Number: ${mobileNumber}`);
    console.log('');
  });

  console.log('✅ Phone prefix field mapping test completed!');
}

// Run the test
if (require.main === module) {
  testFieldMapping();
}

module.exports = { testFieldMapping }; 