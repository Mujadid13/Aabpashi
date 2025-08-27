#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Ensure the API keys directory exists
const keysDir = path.join(process.cwd(), 'data', 'api-keys');
const filePath = path.join(keysDir, 'api-keys.json');

function ensureDirectoryExists() {
  if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir, { recursive: true });
  }
}

function readApiKeys() {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading API keys file:', error);
    return [];
  }
}

function writeApiKeys(apiKeys) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(apiKeys, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing API keys file:', error);
    throw new Error('Failed to save API key');
  }
}

function generateApiKey() {
  return `aabpashi_${crypto.randomBytes(32).toString('hex')}`;
}

function generateId() {
  return crypto.randomBytes(16).toString('hex');
}

function createApiKey(name, permissions = ['read'], userId = null, expiresInDays = null) {
  ensureDirectoryExists();
  
  const apiKeys = readApiKeys();
  
  // Check if name already exists
  const existingKey = apiKeys.find(key => key.name === name);
  if (existingKey) {
    throw new Error('API key with this name already exists');
  }

  const now = new Date().toISOString();
  const expiresAt = expiresInDays 
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
    : undefined;

  const newApiKey = {
    id: generateId(),
    name,
    key: generateApiKey(),
    userId,
    permissions,
    isActive: true,
    createdAt: now,
    expiresAt
  };

  apiKeys.push(newApiKey);
  writeApiKeys(apiKeys);

  return newApiKey;
}

function listApiKeys() {
  const apiKeys = readApiKeys();
  
  if (apiKeys.length === 0) {
    console.log('No API keys found.');
    return;
  }

  console.log('\n📋 API Keys:');
  console.log('─'.repeat(80));
  
  apiKeys.forEach((key, index) => {
    console.log(`${index + 1}. ${key.name}`);
    console.log(`   ID: ${key.id}`);
    console.log(`   Key: ${key.key}`);
    console.log(`   Permissions: ${key.permissions.join(', ')}`);
    console.log(`   Status: ${key.isActive ? '✅ Active' : '❌ Inactive'}`);
    console.log(`   Created: ${new Date(key.createdAt).toLocaleString()}`);
    if (key.lastUsed) {
      console.log(`   Last Used: ${new Date(key.lastUsed).toLocaleString()}`);
    }
    if (key.expiresAt) {
      console.log(`   Expires: ${new Date(key.expiresAt).toLocaleString()}`);
    }
    console.log('');
  });
}

function deleteApiKey(id) {
  const apiKeys = readApiKeys();
  const filteredKeys = apiKeys.filter(key => key.id !== id);
  
  if (filteredKeys.length === apiKeys.length) {
    throw new Error('API key not found');
  }

  writeApiKeys(filteredKeys);
  console.log('✅ API key deleted successfully');
}

function revokeApiKey(id) {
  const apiKeys = readApiKeys();
  const keyIndex = apiKeys.findIndex(key => key.id === id);
  
  if (keyIndex === -1) {
    throw new Error('API key not found');
  }

  apiKeys[keyIndex].isActive = false;
  writeApiKeys(apiKeys);
  console.log('✅ API key revoked successfully');
}

function regenerateApiKey(id) {
  const apiKeys = readApiKeys();
  const keyIndex = apiKeys.findIndex(key => key.id === id);
  
  if (keyIndex === -1) {
    throw new Error('API key not found');
  }

  const newKey = generateApiKey();
  apiKeys[keyIndex].key = newKey;
  writeApiKeys(apiKeys);
  
  console.log('✅ API key regenerated successfully');
  console.log(`New key: ${newKey}`);
}

function showHelp() {
  console.log(`
🔑 AaabPashi API Key Management Tool

Usage:
  node scripts/generate-api-key.js <command> [options]

Commands:
  create <name> [permissions] [userId] [expiresInDays]  Create a new API key
  list                                              List all API keys
  delete <id>                                       Delete an API key
  revoke <id>                                       Revoke an API key (deactivate)
  regenerate <id>                                   Regenerate an API key
  help                                              Show this help message

Examples:
  node scripts/generate-api-key.js create "My App" "read,write" "user123" 30
  node scripts/generate-api-key.js create "Admin Key" "admin"
  node scripts/generate-api-key.js list
  node scripts/generate-api-key.js delete abc123def456
  node scripts/generate-api-key.js revoke abc123def456
  node scripts/generate-api-key.js regenerate abc123def456

Permissions:
  read    - Read access to API endpoints
  write   - Write access to API endpoints
  admin   - Full administrative access
  delete  - Delete access to resources

Notes:
  - API keys are stored in data/api-keys/api-keys.json
  - Keys are prefixed with "aabpashi_"
  - Expiration is optional (null = never expires)
  - User ID is optional (null = no user association)
`);
}

// Main execution
const command = process.argv[2];

try {
  switch (command) {
    case 'create':
      const name = process.argv[3];
      const permissions = process.argv[4] ? process.argv[4].split(',') : ['read'];
      const userId = process.argv[5] || null;
      const expiresInDays = process.argv[6] ? parseInt(process.argv[6]) : null;
      
      if (!name) {
        console.error('❌ Name is required for create command');
        process.exit(1);
      }
      
      const newKey = createApiKey(name, permissions, userId, expiresInDays);
      console.log('✅ API key created successfully!');
      console.log(`Name: ${newKey.name}`);
      console.log(`Key: ${newKey.key}`);
      console.log(`Permissions: ${newKey.permissions.join(', ')}`);
      console.log(`Created: ${new Date(newKey.createdAt).toLocaleString()}`);
      if (newKey.expiresAt) {
        console.log(`Expires: ${new Date(newKey.expiresAt).toLocaleString()}`);
      }
      break;
      
    case 'list':
      listApiKeys();
      break;
      
    case 'delete':
      const deleteId = process.argv[3];
      if (!deleteId) {
        console.error('❌ ID is required for delete command');
        process.exit(1);
      }
      deleteApiKey(deleteId);
      break;
      
    case 'revoke':
      const revokeId = process.argv[3];
      if (!revokeId) {
        console.error('❌ ID is required for revoke command');
        process.exit(1);
      }
      revokeApiKey(revokeId);
      break;
      
    case 'regenerate':
      const regenerateId = process.argv[3];
      if (!regenerateId) {
        console.error('❌ ID is required for regenerate command');
        process.exit(1);
      }
      regenerateApiKey(regenerateId);
      break;
      
    case 'help':
    default:
      showHelp();
      break;
  }
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
} 