#!/usr/bin/env ts-node

/**
 * AabPashi User Migration Script
 * 
 * This script performs a one-time migration of all existing users from the AabPashi
 * MongoDB database to the Farmovation User Server using the REST API routes.
 * 
 * Usage:
 *   npm run migrate:users
 *   npm run migrate:users -- --dry-run
 *   npm run migrate:users -- --batch-size 50
 */

import { MongoClient } from 'mongodb';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

// Types
interface AabPashiUser {
  _id: string;
  name: string;
  phone: string;
  city: string;
  division: string;
  role: string;
  farmsize?: string;
  country: string;
  receiverNetwork?: string;
  createdAt?: Date;
}

interface MigrationResult {
  userId: string;
  phone: string;
  name: string;
  success: boolean;
  error?: string;
  responseTime?: number;
  timestamp: Date;
}

interface MigrationStats {
  total: number;
  successful: number;
  failed: number;
  skipped: number;
  startTime: Date;
  endTime?: Date;
  duration?: number;
}

// Configuration
const CONFIG = {
  batchSize: parseInt(process.argv.find(arg => arg.startsWith('--batch-size='))?.split('=')[1] || '50'),
  dryRun: process.argv.includes('--dry-run'),
  delayBetweenBatches: 1000, // 1 second
  delayBetweenUsers: 100, // 100ms
  maxRetries: 3,
  retryDelay: 2000, // 2 seconds
  logFile: `migration-${new Date().toISOString().split('T')[0]}-${Date.now()}.log`,
  resultsFile: `migration-results-${new Date().toISOString().split('T')[0]}-${Date.now()}.json`
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Logging functions
function log(message: string, color: string = colors.reset) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(`${color}${logMessage}${colors.reset}`);
  
  // Also write to log file
  fs.appendFileSync(CONFIG.logFile, logMessage + '\n');
}

function logSuccess(message: string) {
  log(`✅ ${message}`, colors.green);
}

function logError(message: string) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message: string) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message: string) {
  log(`ℹ️  ${message}`, colors.blue);
}

// Validation functions
function validateEnvironment(): void {
  const requiredEnvVars = [
    'MONGO_URI',
    'FARMOVATION_API_URL',
    'FARMOVATION_API_KEY'
  ];

  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

function validateUser(user: AabPashiUser): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!user.name || user.name.trim().length === 0) {
    errors.push('Missing or empty name');
  }
  
  if (!user.phone || user.phone.trim().length === 0) {
    errors.push('Missing or empty phone');
  }
  
  if (!user.city || user.city.trim().length === 0) {
    errors.push('Missing or empty city');
  }
  
  if (!user.division || user.division.trim().length === 0) {
    errors.push('Missing or empty division');
  }
  
  if (!user.role || user.role.trim().length === 0) {
    errors.push('Missing or empty role');
  }
  
  if (!user.country || user.country.trim().length === 0) {
    errors.push('Missing or empty country');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Database functions
async function connectToDatabase(): Promise<MongoClient> {
  const uri = process.env.MONGO_URI!;
  
  const client = new MongoClient(uri, {
    connectTimeoutMS: 30000,
    serverSelectionTimeoutMS: 30000,
  });

  try {
    await client.connect();
    logSuccess('Connected to MongoDB');
    return client;
  } catch (error) {
    logError(`Failed to connect to MongoDB: ${error}`);
    throw error;
  }
}

async function getAllUsers(client: MongoClient): Promise<AabPashiUser[]> {
  const db = client.db('WaterVation');
  const collection = db.collection('Users');
  
  try {
    const users = await collection.find({}).toArray() as unknown as AabPashiUser[];
    logSuccess(`Found ${users.length} users in database`);
    return users;
  } catch (error) {
    logError(`Failed to fetch users: ${error}`);
    throw error;
  }
}

// API functions
async function migrateUserToFarmovation(user: AabPashiUser): Promise<MigrationResult> {
  const startTime = Date.now();
  
  try {
    // Prepare user data for Farmovation API
    const userData = {
      name: user.name,
      phone: user.phone,
      city: user.city,
      division: user.division,
      role: user.role,
      farmsize: user.farmsize,
      country: user.country,
      receiverNetwork: user.receiverNetwork,
      _id: user._id.toString(),
      createdAt: user.createdAt
    };

    const response = await axios.post(
              `${process.env.FARMOVATION_API_URL}/api/sync/create-user`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.FARMOVATION_API_KEY,
          'X-Source': 'aabpashi-migration'
        },
        timeout: 30000
      }
    );

    const responseTime = Date.now() - startTime;
    
    if (response.status === 200 && response.data.success) {
      return {
        userId: user._id.toString(),
        phone: user.phone,
        name: user.name,
        success: true,
        responseTime,
        timestamp: new Date()
      };
    } else {
      return {
        userId: user._id.toString(),
        phone: user.phone,
        name: user.name,
        success: false,
        error: `API returned status ${response.status}: ${JSON.stringify(response.data)}`,
        responseTime,
        timestamp: new Date()
      };
    }
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    return {
      userId: user._id.toString(),
      phone: user.phone,
      name: user.name,
      success: false,
      error: error.response?.data?.message || error.message || 'Unknown error',
      responseTime,
      timestamp: new Date()
    };
  }
}

async function migrateUserWithRetry(user: AabPashiUser): Promise<MigrationResult> {
  for (let attempt = 1; attempt <= CONFIG.maxRetries; attempt++) {
    const result = await migrateUserToFarmovation(user);
    
    if (result.success) {
      return result;
    }
    
    if (attempt < CONFIG.maxRetries) {
      logWarning(`Retry ${attempt}/${CONFIG.maxRetries} for user ${user.phone} (${user.name})`);
      await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelay));
    }
  }
  
  // Return the last failed result
  return await migrateUserToFarmovation(user);
}

// Main migration function
async function migrateUsers(users: AabPashiUser[]): Promise<MigrationStats> {
  const stats: MigrationStats = {
    total: users.length,
    successful: 0,
    failed: 0,
    skipped: 0,
    startTime: new Date()
  };

  const results: MigrationResult[] = [];
  
  logInfo(`Starting migration of ${users.length} users`);
  logInfo(`Batch size: ${CONFIG.batchSize}`);
  logInfo(`Dry run: ${CONFIG.dryRun}`);
  
  // Process users in batches
  for (let i = 0; i < users.length; i += CONFIG.batchSize) {
    const batch = users.slice(i, i + CONFIG.batchSize);
    const batchNumber = Math.floor(i / CONFIG.batchSize) + 1;
    const totalBatches = Math.ceil(users.length / CONFIG.batchSize);
    
    logInfo(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} users)`);
    
    for (const user of batch) {
      // Validate user data
      const validation = validateUser(user);
      if (!validation.valid) {
        logWarning(`Skipping user ${user.phone} (${user.name}): ${validation.errors.join(', ')}`);
        stats.skipped++;
        results.push({
          userId: user._id.toString(),
          phone: user.phone,
          name: user.name,
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`,
          timestamp: new Date()
        });
        continue;
      }
      
      if (CONFIG.dryRun) {
        logInfo(`[DRY RUN] Would migrate user: ${user.phone} (${user.name})`);
        stats.skipped++;
        results.push({
          userId: user._id.toString(),
          phone: user.phone,
          name: user.name,
          success: true,
          timestamp: new Date()
        });
        continue;
      }
      
      // Migrate user
      const result = await migrateUserWithRetry(user);
      results.push(result);
      
      if (result.success) {
        logSuccess(`Migrated: ${user.phone} (${user.name})`);
        stats.successful++;
      } else {
        logError(`Failed: ${user.phone} (${user.name}) - ${result.error}`);
        stats.failed++;
      }
      
      // Small delay between users to avoid overwhelming the API
      if (CONFIG.delayBetweenUsers > 0) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenUsers));
      }
    }
    
    // Delay between batches
    if (i + CONFIG.batchSize < users.length && CONFIG.delayBetweenBatches > 0) {
      logInfo(`Waiting ${CONFIG.delayBetweenBatches}ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenBatches));
    }
  }
  
  stats.endTime = new Date();
  stats.duration = stats.endTime.getTime() - stats.startTime.getTime();
  
  // Save results to file
  const resultsData = {
    stats,
    results,
    config: CONFIG,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(CONFIG.resultsFile, JSON.stringify(resultsData, null, 2));
  
  return stats;
}

// Main execution
async function main() {
  try {
    logInfo('Starting AabPashi User Migration Script');
    logInfo('=====================================');
    
    // Validate environment
    validateEnvironment();
    logSuccess('Environment validation passed');
    
    // Connect to database
    const client = await connectToDatabase();
    
    try {
      // Get all users
      const users = await getAllUsers(client);
      
      if (users.length === 0) {
        logWarning('No users found in database');
        return;
      }
      
      // Perform migration
      const stats = await migrateUsers(users);
      
      // Print summary
      logInfo('Migration completed!');
      logInfo('==================');
      logInfo(`Total users: ${stats.total}`);
      logInfo(`Successful: ${stats.successful}`);
      logInfo(`Failed: ${stats.failed}`);
      logInfo(`Skipped: ${stats.skipped}`);
      logInfo(`Duration: ${Math.round(stats.duration! / 1000)} seconds`);
      logInfo(`Results saved to: ${CONFIG.resultsFile}`);
      logInfo(`Log saved to: ${CONFIG.logFile}`);
      
      if (stats.failed > 0) {
        logWarning(`${stats.failed} users failed to migrate. Check the results file for details.`);
      }
      
    } finally {
      await client.close();
      logSuccess('Database connection closed');
    }
    
  } catch (error) {
    logError(`Migration failed: ${error}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { migrateUsers, validateUser };
export type { MigrationResult, MigrationStats }; 