#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(process.cwd(), 'config', 'sync-platforms.json');

function loadConfig() {
  try {
    const configData = fs.readFileSync(CONFIG_PATH, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.error('Failed to load sync config:', error.message);
    process.exit(1);
  }
}

function saveConfig(config) {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    console.log('Configuration saved successfully');
  } catch (error) {
    console.error('Failed to save config:', error.message);
    process.exit(1);
  }
}

function listPlatforms() {
  const config = loadConfig();
  console.log('\n📋 Sync Platforms Configuration:');
  console.log('=====================================');
  
  config.platforms.forEach((platform, index) => {
    const status = platform.enabled ? '✅ Enabled' : '❌ Disabled';
    const configured = process.env[platform.apiKeyEnvVar] && process.env[platform.baseUrlEnvVar] 
      ? '✅ Configured' 
      : '❌ Not Configured';
    
    console.log(`\n${index + 1}. ${platform.displayName} (${platform.name})`);
    console.log(`   Status: ${status} | Config: ${configured}`);
    console.log(`   Base URL: ${process.env[platform.baseUrlEnvVar] || platform.defaultBaseUrl}`);
    console.log(`   Timeout: ${platform.timeout}ms`);
    console.log(`   Retry Policy: ${platform.retryPolicy.maxAttempts} attempts, ${platform.retryPolicy.initialDelayMs}ms initial delay`);
  });
  
  console.log('\n🌐 Global Settings:');
  console.log(`   Default Timeout: ${config.global.defaultTimeout}ms`);
  console.log(`   Max Concurrent Syncs: ${config.global.maxConcurrentSyncs}`);
  console.log(`   Retry Interval: ${config.global.retryIntervalMinutes} minutes`);
  console.log(`   Logging: ${config.global.enableLogging ? 'Enabled' : 'Disabled'}`);
}

function enablePlatform(platformName) {
  const config = loadConfig();
  const platform = config.platforms.find(p => p.name === platformName);
  
  if (!platform) {
    console.error(`❌ Platform '${platformName}' not found`);
    process.exit(1);
  }
  
  platform.enabled = true;
  saveConfig(config);
  console.log(`✅ Platform '${platformName}' enabled`);
}

function disablePlatform(platformName) {
  const config = loadConfig();
  const platform = config.platforms.find(p => p.name === platformName);
  
  if (!platform) {
    console.error(`❌ Platform '${platformName}' not found`);
    process.exit(1);
  }
  
  platform.enabled = false;
  saveConfig(config);
  console.log(`✅ Platform '${platformName}' disabled`);
}

function addPlatform(platformData) {
  const config = loadConfig();
  
  // Validate required fields
  const requiredFields = ['name', 'displayName', 'baseUrlEnvVar', 'apiKeyEnvVar'];
  for (const field of requiredFields) {
    if (!platformData[field]) {
      console.error(`❌ Missing required field: ${field}`);
      process.exit(1);
    }
  }
  
  // Check if platform already exists
  if (config.platforms.find(p => p.name === platformData.name)) {
    console.error(`❌ Platform '${platformData.name}' already exists`);
    process.exit(1);
  }
  
  const newPlatform = {
    name: platformData.name,
    displayName: platformData.displayName,
    enabled: platformData.enabled !== undefined ? platformData.enabled : false,
    baseUrlEnvVar: platformData.baseUrlEnvVar,
    apiKeyEnvVar: platformData.apiKeyEnvVar,
    defaultBaseUrl: platformData.defaultBaseUrl || `https://api.${platformData.name}.com`,
    timeout: platformData.timeout || config.global.defaultTimeout,
    endpoints: {
              create: platformData.endpoints?.create || "/api/sync/create-user",
        update: platformData.endpoints?.update || "/api/sync/update-user",
        delete: platformData.endpoints?.delete || "/api/sync/delete-user",
      test: platformData.endpoints?.test || "/api/health"
    },
    headers: {
      "Content-Type": "application/json",
      "X-Source": "aabpashi",
      ...platformData.headers
    },
    retryPolicy: {
      maxAttempts: platformData.retryPolicy?.maxAttempts || 3,
      backoffMultiplier: platformData.retryPolicy?.backoffMultiplier || 2,
      initialDelayMs: platformData.retryPolicy?.initialDelayMs || 1000
    }
  };
  
  config.platforms.push(newPlatform);
  saveConfig(config);
  console.log(`✅ Platform '${platformData.name}' added successfully`);
}

function removePlatform(platformName) {
  const config = loadConfig();
  const platformIndex = config.platforms.findIndex(p => p.name === platformName);
  
  if (platformIndex === -1) {
    console.error(`❌ Platform '${platformName}' not found`);
    process.exit(1);
  }
  
  const removedPlatform = config.platforms.splice(platformIndex, 1)[0];
  saveConfig(config);
  console.log(`✅ Platform '${removedPlatform.displayName}' removed successfully`);
}

function updateGlobalSettings(settings) {
  const config = loadConfig();
  
  Object.keys(settings).forEach(key => {
    if (config.global.hasOwnProperty(key)) {
      config.global[key] = settings[key];
    }
  });
  
  saveConfig(config);
  console.log('✅ Global settings updated successfully');
}

function showHelp() {
  console.log(`
🔧 Sync Platforms Management Tool

Usage: node scripts/manage-sync-platforms.js <command> [options]

Commands:
  list                                    Show all platforms and their status
  enable <platform-name>                  Enable a platform
  disable <platform-name>                 Disable a platform
  add <platform-name> <display-name>      Add a new platform
  remove <platform-name>                  Remove a platform
  global <setting> <value>                Update global settings

Examples:
  node scripts/manage-sync-platforms.js list
  node scripts/manage-sync-platforms.js enable farmovation
  node scripts/manage-sync-platforms.js disable water_management
  node scripts/manage-sync-platforms.js add new_platform "New Platform"
  node scripts/manage-sync-platforms.js remove irrigation_analytics
  node scripts/manage-sync-platforms.js global defaultTimeout 45000

Environment Variables:
  Make sure to set the corresponding environment variables for each platform:
  - FARMOVATION_API_URL and FARMOVATION_API_KEY
  - WATER_MANAGEMENT_API_URL and WATER_MANAGEMENT_API_KEY
  - etc.
`);
}

function main() {
  const command = process.argv[2];
  const args = process.argv.slice(3);
  
  switch (command) {
    case 'list':
      listPlatforms();
      break;
      
    case 'enable':
      if (args.length < 1) {
        console.error('❌ Platform name required');
        process.exit(1);
      }
      enablePlatform(args[0]);
      break;
      
    case 'disable':
      if (args.length < 1) {
        console.error('❌ Platform name required');
        process.exit(1);
      }
      disablePlatform(args[0]);
      break;
      
    case 'add':
      if (args.length < 2) {
        console.error('❌ Platform name and display name required');
        process.exit(1);
      }
      addPlatform({
        name: args[0],
        displayName: args[1],
        baseUrlEnvVar: `${args[0].toUpperCase()}_API_URL`,
        apiKeyEnvVar: `${args[0].toUpperCase()}_API_KEY`
      });
      break;
      
    case 'remove':
      if (args.length < 1) {
        console.error('❌ Platform name required');
        process.exit(1);
      }
      removePlatform(args[0]);
      break;
      
    case 'global':
      if (args.length < 2) {
        console.error('❌ Setting name and value required');
        process.exit(1);
      }
      const setting = args[0];
      const value = isNaN(args[1]) ? args[1] === 'true' : parseInt(args[1]);
      updateGlobalSettings({ [setting]: value });
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