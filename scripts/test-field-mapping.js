#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Mock user data for testing
const sampleUserData = {
  name: "John Doe",
  phone: "+923001234567",
  city: "Lahore",
  division: "Kasur",
  role: "Farmer",
  farmsize: "5-10 acres",
  country: "Pakistan",
  receiverNetwork: "Jazz",
  _id: "user123",
  createdAt: "2024-01-01T00:00:00.000Z"
};

// Mock field mappers for testing
const fieldMappers = {
  farmovation: {
    adaptUserData: (userData, sourcePlatform) => {
      const nameParts = userData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      return {
        userData: {
          email: `${userData.phone.replace(/[^0-9]/g, '')}@aabpashi.com`,
          phoneNumber: userData.phone,
          firstName: firstName,
          lastName: lastName,
          country: userData.country,
          city: userData.city,
          address: `${userData.city}, ${userData.division}`,
          userType: userData.role.toLowerCase(),
          preferredLanguage: 'en',
          sourcePlatform: sourcePlatform,
          originalUserId: userData._id,
          metadata: {
            division: userData.division,
            farmsize: userData.farmsize,
            receiverNetwork: userData.receiverNetwork,
            createdAt: userData.createdAt
          }
        },
        force: false
      };
    }
  },
  farmovation_marketplace: {
    adaptUserData: (userData, sourcePlatform) => {
      const nameParts = userData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      return {
        seller: {
          sellerId: userData._id,
          profile: {
            firstName: firstName,
            lastName: lastName,
            fullName: userData.name,
            email: `${userData.phone.replace(/[^0-9]/g, '')}@aabpashi.com`,
            phone: userData.phone,
            businessName: `${userData.name} Farm`,
            businessType: userData.role.toLowerCase(),
            category: "agriculture"
          },
          location: {
            city: userData.city,
            state: userData.division,
            country: userData.country,
            address: `${userData.city}, ${userData.division}, ${userData.country}`
          },
          businessDetails: {
            farmSize: userData.farmsize,
            specializations: [userData.role],
            mobileOperator: userData.receiverNetwork,
            registrationDate: userData.createdAt
          },
          marketplace: {
            status: "active",
            verificationStatus: "pending",
            rating: 0,
            totalSales: 0
          },
          integration: {
            sourcePlatform: sourcePlatform,
            externalUserId: userData._id,
            importedAt: new Date().toISOString(),
            syncVersion: "1.0"
          }
        }
      };
    }
  }
};

function testFieldMapping() {
  console.log('🧪 Testing Field Mapping System');
  console.log('================================');
  
  const sourcePlatform = 'aabpashi';
  let allTestsPassed = true;
  const testResults = [];
  
  // Test each field mapper
  Object.entries(fieldMappers).forEach(([mapperName, mapper]) => {
    console.log(`\n📋 Testing ${mapperName} mapper...`);
    
    try {
      const adaptedData = mapper.adaptUserData(sampleUserData, sourcePlatform);
      
      // Validate the adapted data
      const validationResult = validateAdaptedData(mapperName, adaptedData, sourcePlatform);
      
      if (validationResult.success) {
        console.log(`✅ ${mapperName} mapper: PASSED`);
        testResults.push({
          mapper: mapperName,
          status: 'PASSED',
          data: adaptedData
        });
      } else {
        console.log(`❌ ${mapperName} mapper: FAILED - ${validationResult.error}`);
        testResults.push({
          mapper: mapperName,
          status: 'FAILED',
          error: validationResult.error
        });
        allTestsPassed = false;
      }
      
    } catch (error) {
      console.log(`❌ ${mapperName} mapper: ERROR - ${error.message}`);
      testResults.push({
        mapper: mapperName,
        status: 'ERROR',
        error: error.message
      });
      allTestsPassed = false;
    }
  });
  
  // Test source platform consistency
  console.log('\n🔍 Testing source platform consistency...');
  const sourcePlatformTest = testSourcePlatformConsistency();
  if (sourcePlatformTest.success) {
    console.log('✅ Source platform consistency: PASSED');
  } else {
    console.log(`❌ Source platform consistency: FAILED - ${sourcePlatformTest.error}`);
    allTestsPassed = false;
  }
  
  // Test data transformation
  console.log('\n🔄 Testing data transformation...');
  const transformationTest = testDataTransformation();
  if (transformationTest.success) {
    console.log('✅ Data transformation: PASSED');
  } else {
    console.log(`❌ Data transformation: FAILED - ${transformationTest.error}`);
    allTestsPassed = false;
  }
  
  // Summary
  console.log('\n📊 Test Summary');
  console.log('===============');
  console.log(`Total mappers tested: ${Object.keys(fieldMappers).length}`);
  console.log(`Passed: ${testResults.filter(r => r.status === 'PASSED').length}`);
  console.log(`Failed: ${testResults.filter(r => r.status === 'FAILED').length}`);
  console.log(`Errors: ${testResults.filter(r => r.status === 'ERROR').length}`);
  
  if (allTestsPassed) {
    console.log('\n🎉 All field mapping tests passed!');
  } else {
    console.log('\n⚠️  Some field mapping tests failed. Check the details above.');
  }
  
  // Save detailed results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const resultsFile = `test-results/field_mapping_test_${timestamp}.json`;
  
  if (!fs.existsSync('test-results')) {
    fs.mkdirSync('test-results', { recursive: true });
  }
  
  const detailedResults = {
    timestamp: new Date().toISOString(),
    testName: 'Field Mapping System Test',
    inputData: sampleUserData,
    sourcePlatform: sourcePlatform,
    results: testResults,
    summary: {
      total: testResults.length,
      passed: testResults.filter(r => r.status === 'PASSED').length,
      failed: testResults.filter(r => r.status === 'FAILED').length,
      errors: testResults.filter(r => r.status === 'ERROR').length,
      allPassed: allTestsPassed
    }
  };
  
  fs.writeFileSync(resultsFile, JSON.stringify(detailedResults, null, 2));
  console.log(`\n📄 Detailed results saved to: ${resultsFile}`);
  
  return allTestsPassed;
}

function validateAdaptedData(mapperName, adaptedData, sourcePlatform) {
  try {
    switch (mapperName) {
      case 'farmovation':
        if (!adaptedData.userData) {
          return { success: false, error: 'Missing userData object' };
        }
        if (!adaptedData.userData.sourcePlatform || adaptedData.userData.sourcePlatform !== sourcePlatform) {
          return { success: false, error: 'Incorrect or missing sourcePlatform' };
        }
        if (!adaptedData.userData.firstName || !adaptedData.userData.lastName) {
          return { success: false, error: 'Name not properly split into firstName/lastName' };
        }
        if (!adaptedData.userData.email || !adaptedData.userData.email.includes('@aabpashi.com')) {
          return { success: false, error: 'Email not properly generated' };
        }
        break;
        
             case 'farmovation_marketplace':
         if (!adaptedData.seller) {
           return { success: false, error: 'Missing seller object' };
         }
         if (!adaptedData.seller.integration || adaptedData.seller.integration.sourcePlatform !== sourcePlatform) {
           return { success: false, error: 'Incorrect or missing source platform' };
         }
         if (!adaptedData.seller.profile || !adaptedData.seller.location) {
           return { success: false, error: 'Missing profile or location data' };
         }
         if (!adaptedData.seller.marketplace || adaptedData.seller.marketplace.status !== 'active') {
           return { success: false, error: 'Missing or incorrect marketplace status' };
         }
         break;
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function testSourcePlatformConsistency() {
  try {
    const sourcePlatform = 'aabpashi';
    
    // Test that all mappers include the source platform
    for (const [mapperName, mapper] of Object.entries(fieldMappers)) {
      const adaptedData = mapper.adaptUserData(sampleUserData, sourcePlatform);
      
      let hasSourcePlatform = false;
      
             switch (mapperName) {
         case 'farmovation':
           hasSourcePlatform = adaptedData.userData?.sourcePlatform === sourcePlatform;
           break;
         case 'farmovation_marketplace':
           hasSourcePlatform = adaptedData.seller?.integration?.sourcePlatform === sourcePlatform;
           break;
       }
      
      if (!hasSourcePlatform) {
        return { success: false, error: `${mapperName} mapper missing source platform` };
      }
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function testDataTransformation() {
  try {
    const sourcePlatform = 'aabpashi';
    
    // Test that data is properly transformed
    for (const [mapperName, mapper] of Object.entries(fieldMappers)) {
      const adaptedData = mapper.adaptUserData(sampleUserData, sourcePlatform);
      
      // Check that original data is preserved in some form
      let hasOriginalData = false;
      
             switch (mapperName) {
         case 'farmovation':
           hasOriginalData = adaptedData.userData?.metadata?.division === sampleUserData.division;
           break;
         case 'farmovation_marketplace':
           hasOriginalData = adaptedData.seller?.location?.state === sampleUserData.division;
           break;
       }
      
      if (!hasOriginalData) {
        return { success: false, error: `${mapperName} mapper not preserving original data` };
      }
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function showSampleOutput() {
  console.log('\n📋 Sample Field Mapping Output');
  console.log('==============================');
  
  const sourcePlatform = 'aabpashi';
  
  Object.entries(fieldMappers).forEach(([mapperName, mapper]) => {
    console.log(`\n${mapperName.toUpperCase()} MAPPER:`);
    console.log(JSON.stringify(mapper.adaptUserData(sampleUserData, sourcePlatform), null, 2));
  });
}

function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'test':
      testFieldMapping();
      break;
      
    case 'sample':
      showSampleOutput();
      break;
      
    case 'help':
    case '--help':
    case '-h':
      console.log(`
🧪 Field Mapping Test Tool

Usage: node scripts/test-field-mapping.js <command>

Commands:
  test                    Run comprehensive field mapping tests
  sample                  Show sample output from all mappers
  help                    Show this help message

Examples:
  node scripts/test-field-mapping.js test
  node scripts/test-field-mapping.js sample
`);
      break;
      
    default:
      console.log('❌ Unknown command. Use "help" for usage information.');
      process.exit(1);
  }
}

if (require.main === module) {
  main();
} 