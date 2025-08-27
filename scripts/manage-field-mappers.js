#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Mock the sync field mapper for CLI operations
const fieldMappers = {
  farmovation: {
    name: 'farmovation',
    displayName: 'Farmovation User Server',
    description: 'Maps to Farmovation User Server API format'
  },
  farmovation_marketplace: {
    name: 'farmovation_marketplace',
    displayName: 'Farmovation Marketplace Platform',
    description: 'Maps to Farmovation Marketplace API format for e-commerce sellers'
  },
  generic: {
    name: 'generic',
    displayName: 'Generic Platform',
    description: 'Default mapper for unknown platforms'
  }
};

function showHelp() {
  console.log(`
🔧 Field Mapper Management Tool

Usage: node scripts/manage-field-mappers.js <command> [options]

Commands:
  list                                    Show all available field mappers
  info <mapper-name>                      Show detailed info about a mapper
  test <mapper-name>                      Test field mapping with sample data
  create <mapper-name> <display-name>     Create a new custom field mapper

Examples:
  node scripts/manage-field-mappers.js list
  node scripts/manage-field-mappers.js info farmovation
  node scripts/manage-field-mappers.js test water_management
  node scripts/manage-field-mappers.js create custom_platform "Custom Platform"

Field Mapping:
  Each platform has its own API format. Field mappers adapt AabPashi user data
  to the specific format expected by each platform's API.

  AabPashi User Data Format:
  {
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
  }
`);
}

function listMappers() {
  console.log('\n📋 Available Field Mappers:');
  console.log('=============================');
  
  Object.values(fieldMappers).forEach((mapper, index) => {
    console.log(`\n${index + 1}. ${mapper.displayName} (${mapper.name})`);
    console.log(`   Description: ${mapper.description}`);
  });
  
  console.log('\n💡 Each mapper adapts AabPashi user data to the specific API format');
  console.log('   expected by each platform. The source platform is always set to "aabpashi".');
}

function showMapperInfo(mapperName) {
  const mapper = fieldMappers[mapperName];
  
  if (!mapper) {
    console.error(`❌ Mapper '${mapperName}' not found`);
    process.exit(1);
  }
  
  console.log(`\n📋 Field Mapper: ${mapper.displayName}`);
  console.log('=====================================');
  console.log(`Name: ${mapper.name}`);
  console.log(`Description: ${mapper.description}`);
  
  // Show mapping examples based on mapper
  console.log('\n🔄 Field Mapping Examples:');
  
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
  
  switch (mapperName) {
    case 'farmovation':
      console.log('\nFarmovation User Server Format:');
      console.log(JSON.stringify({
        userData: {
          email: "3001234567@aabpashi.com",
          phoneNumber: "+923001234567",
          firstName: "John",
          lastName: "Doe",
          country: "Pakistan",
          city: "Lahore",
          address: "Lahore, Kasur",
          userType: "farmer",
          preferredLanguage: "en",
          sourcePlatform: "aabpashi",
          originalUserId: "user123",
          metadata: {
            division: "Kasur",
            farmsize: "5-10 acres",
            receiverNetwork: "Jazz",
            createdAt: "2024-01-01T00:00:00.000Z"
          }
        },
        force: false
      }, null, 2));
      break;
      
         case 'farmovation_marketplace':
       console.log('\nFarmovation Marketplace Platform Format:');
       console.log(JSON.stringify({
         seller: {
           sellerId: "user123",
           profile: {
             firstName: "John",
             lastName: "Doe",
             fullName: "John Doe",
             email: "3001234567@aabpashi.com",
             phone: "+923001234567",
             businessName: "John Doe Farm",
             businessType: "farmer",
             category: "agriculture"
           },
           location: {
             city: "Lahore",
             state: "Kasur",
             country: "Pakistan",
             address: "Lahore, Kasur, Pakistan"
           },
           businessDetails: {
             farmSize: "5-10 acres",
             specializations: ["Farmer"],
             mobileOperator: "Jazz",
             registrationDate: "2024-01-01T00:00:00.000Z"
           },
           marketplace: {
             status: "active",
             verificationStatus: "pending",
             rating: 0,
             totalSales: 0
           },
           integration: {
             sourcePlatform: "aabpashi",
             externalUserId: "user123",
             importedAt: new Date().toISOString(),
             syncVersion: "1.0"
           }
         }
       }, null, 2));
       break;
      
    default:
      console.log('\nGeneric Platform Format:');
      console.log(JSON.stringify({
        user: {
          id: "user123",
          name: "John Doe",
          phone: "+923001234567",
          email: "3001234567@aabpashi.com",
          city: "Lahore",
          division: "Kasur",
          country: "Pakistan",
          role: "Farmer",
          farmsize: "5-10 acres",
          receiverNetwork: "Jazz",
          sourcePlatform: "aabpashi",
          originalId: "user123",
          createdAt: "2024-01-01T00:00:00.000Z"
        }
      }, null, 2));
  }
}

function testMapper(mapperName) {
  const mapper = fieldMappers[mapperName];
  
  if (!mapper) {
    console.error(`❌ Mapper '${mapperName}' not found`);
    process.exit(1);
  }
  
  console.log(`\n🧪 Testing Field Mapper: ${mapper.displayName}`);
  console.log('=====================================');
  
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
  
  console.log('\n📥 Input (AabPashi Format):');
  console.log(JSON.stringify(sampleUserData, null, 2));
  
  console.log('\n📤 Output (Adapted Format):');
  
  // Simulate the mapping logic
  let adaptedData;
  const sourcePlatform = 'aabpashi';
  
  switch (mapperName) {
    case 'farmovation':
      const nameParts = sampleUserData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      adaptedData = {
        userData: {
          email: `${sampleUserData.phone.replace(/[^0-9]/g, '')}@aabpashi.com`,
          phoneNumber: sampleUserData.phone,
          firstName: firstName,
          lastName: lastName,
          country: sampleUserData.country,
          city: sampleUserData.city,
          address: `${sampleUserData.city}, ${sampleUserData.division}`,
          userType: sampleUserData.role.toLowerCase(),
          preferredLanguage: 'en',
          sourcePlatform: sourcePlatform,
          originalUserId: sampleUserData._id,
          metadata: {
            division: sampleUserData.division,
            farmsize: sampleUserData.farmsize,
            receiverNetwork: sampleUserData.receiverNetwork,
            createdAt: sampleUserData.createdAt
          }
        },
        force: false
      };
      break;
      
         case 'farmovation_marketplace':
       const marketplaceNameParts = sampleUserData.name.trim().split(' ');
       const marketplaceFirstName = marketplaceNameParts[0] || '';
       const marketplaceLastName = marketplaceNameParts.slice(1).join(' ') || '';
       
       adaptedData = {
         seller: {
           sellerId: sampleUserData._id,
           profile: {
             firstName: marketplaceFirstName,
             lastName: marketplaceLastName,
             fullName: sampleUserData.name,
             email: `${sampleUserData.phone.replace(/[^0-9]/g, '')}@aabpashi.com`,
             phone: sampleUserData.phone,
             businessName: `${sampleUserData.name} Farm`,
             businessType: sampleUserData.role.toLowerCase(),
             category: "agriculture"
           },
           location: {
             city: sampleUserData.city,
             state: sampleUserData.division,
             country: sampleUserData.country,
             address: `${sampleUserData.city}, ${sampleUserData.division}, ${sampleUserData.country}`
           },
           businessDetails: {
             farmSize: sampleUserData.farmsize,
             specializations: [sampleUserData.role],
             mobileOperator: sampleUserData.receiverNetwork,
             registrationDate: sampleUserData.createdAt
           },
           marketplace: {
             status: "active",
             verificationStatus: "pending",
             rating: 0,
             totalSales: 0
           },
           integration: {
             sourcePlatform: sourcePlatform,
             externalUserId: sampleUserData._id,
             importedAt: new Date().toISOString(),
             syncVersion: "1.0"
           }
         }
       };
       break;
      
    default:
      adaptedData = {
        user: {
          id: sampleUserData._id,
          name: sampleUserData.name,
          phone: sampleUserData.phone,
          email: `${sampleUserData.phone.replace(/[^0-9]/g, '')}@aabpashi.com`,
          city: sampleUserData.city,
          division: sampleUserData.division,
          country: sampleUserData.country,
          role: sampleUserData.role,
          farmsize: sampleUserData.farmsize,
          receiverNetwork: sampleUserData.receiverNetwork,
          sourcePlatform: sourcePlatform,
          originalId: sampleUserData._id,
          createdAt: sampleUserData.createdAt
        }
      };
  }
  
  console.log(JSON.stringify(adaptedData, null, 2));
  
  console.log('\n✅ Field mapping test completed successfully!');
  console.log(`📝 This shows how user data is adapted for the ${mapper.displayName} API.`);
}

function createCustomMapper(mapperName, displayName) {
  console.log(`\n🔧 Creating Custom Field Mapper: ${displayName}`);
  console.log('=====================================');
  
  if (fieldMappers[mapperName]) {
    console.error(`❌ Mapper '${mapperName}' already exists`);
    process.exit(1);
  }
  
  console.log(`\n📝 Custom mapper '${mapperName}' would be created with display name '${displayName}'`);
  console.log('\n💡 To implement a custom field mapper:');
  console.log('1. Add the mapper to lib/sync-field-mappers.ts');
  console.log('2. Implement the adaptUserData, adaptUserUpdate, and adaptUserDelete methods');
  console.log('3. Register the mapper in the fieldMappers object');
  console.log('4. Update the platform configuration in config/sync-platforms.json');
  
  console.log('\n📋 Example implementation:');
  console.log(`
const customMapper: FieldMapper = {
  name: '${mapperName}',
  displayName: '${displayName}',
  
  adaptUserData: (userData: UserData, sourcePlatform: string) => {
    return {
      // Adapt to your platform's API format
      user: {
        id: userData._id,
        name: userData.name,
        phone: userData.phone,
        // ... other fields
        sourcePlatform: sourcePlatform
      }
    };
  },
  
  adaptUserUpdate: (userData: Partial<UserData>, sourcePlatform: string) => {
    // Implementation for user updates
  },
  
  adaptUserDelete: (userData: UserDeleteData, sourcePlatform: string) => {
    // Implementation for user deletion
  }
};
`);
}

function main() {
  const command = process.argv[2];
  const args = process.argv.slice(3);
  
  switch (command) {
    case 'list':
      listMappers();
      break;
      
    case 'info':
      if (args.length < 1) {
        console.error('❌ Mapper name required');
        process.exit(1);
      }
      showMapperInfo(args[0]);
      break;
      
    case 'test':
      if (args.length < 1) {
        console.error('❌ Mapper name required');
        process.exit(1);
      }
      testMapper(args[0]);
      break;
      
    case 'create':
      if (args.length < 2) {
        console.error('❌ Mapper name and display name required');
        process.exit(1);
      }
      createCustomMapper(args[0], args[1]);
      break;
      
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
      
    default:
      console.error('❌ Unknown command. Use "help" for usage information.');
      process.exit(1);
  }
}

if (require.main === module) {
  main();
} 