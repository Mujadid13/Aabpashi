import fs from 'fs';
import path from 'path';
import { syncFieldMapper } from './sync-field-mappers';

interface SyncPlatform {
  name: string;
  displayName: string;
  enabled: boolean;
  baseUrlEnvVar: string;
  apiKeyEnvVar: string;
  defaultBaseUrl: string;
  timeout: number;
  endpoints: {
    create: string;
    update: string;
    delete: string;
    test: string;
  };
  headers: Record<string, string>;
  retryPolicy: {
    maxAttempts: number;
    backoffMultiplier: number;
    initialDelayMs: number;
  };
  fieldMapper?: string;
  description?: string;
}

interface SyncConfig {
  platforms: SyncPlatform[];
  global: {
    defaultTimeout: number;
    maxConcurrentSyncs: number;
    retryIntervalMinutes: number;
    enableLogging: boolean;
    logLevel: string;
  };
}

interface SyncResult {
  platform: string;
  success: boolean;
  error?: string;
  responseTime?: number;
  statusCode?: number;
}

interface UserData {
  name: string;
  phone: string;
  city: string;
  division: string;
  role: string;
  farmsize?: string;
  country: string;
  receiverNetwork?: string;
  _id?: string;
  createdAt?: Date;
}

interface UserDeleteData {
  phone: string;
  _id?: string;
}

class MultiPlatformSync {
  private config: SyncConfig;
  private configPath: string;

  constructor() {
    this.configPath = path.join(process.cwd(), 'config', 'sync-platforms.json');
    this.config = this.loadConfig();
  }

  private loadConfig(): SyncConfig {
    try {
      const configData = fs.readFileSync(this.configPath, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      console.error('Failed to load sync config:', error);
      return {
        platforms: [],
        global: {
          defaultTimeout: 30000,
          maxConcurrentSyncs: 5,
          retryIntervalMinutes: 5,
          enableLogging: true,
          logLevel: 'info'
        }
      };
    }
  }

  private getEnabledPlatforms(): SyncPlatform[] {
    return this.config.platforms.filter(platform => platform.enabled);
  }

  private getPlatformConfig(platform: SyncPlatform): {
    baseUrl: string;
    apiKey: string;
  } {
    const baseUrl = process.env[platform.baseUrlEnvVar] || platform.defaultBaseUrl;
    const apiKey = process.env[platform.apiKeyEnvVar];

    if (!apiKey) {
      throw new Error(`API key not found for platform ${platform.name} (${platform.apiKeyEnvVar})`);
    }

    return { baseUrl, apiKey };
  }

  private async makeSyncRequest(
    platform: SyncPlatform,
    endpoint: 'create' | 'update' | 'delete',
    userData: UserData | UserDeleteData
  ): Promise<SyncResult> {
    const startTime = Date.now();
    
    try {
      const { baseUrl, apiKey } = this.getPlatformConfig(platform);
      const url = `${baseUrl}${platform.endpoints[endpoint]}`;
      
      // Adapt user data for the specific platform
      let adaptedData: any;
      const sourcePlatform = 'aabpashi';
      const fieldMapperName = platform.fieldMapper || platform.name;
      
      switch (endpoint) {
        case 'create':
          adaptedData = syncFieldMapper.adaptUserData(fieldMapperName, userData as UserData, sourcePlatform);
          break;
        case 'update':
          adaptedData = syncFieldMapper.adaptUserUpdate(fieldMapperName, userData as Partial<UserData>, sourcePlatform);
          break;
        case 'delete':
          adaptedData = syncFieldMapper.adaptUserDelete(fieldMapperName, userData as UserDeleteData, sourcePlatform);
          break;
      }
      
      const headers = {
        ...platform.headers,
        'X-API-Key': apiKey,
        'User-Agent': 'AabPashi-Sync/1.0'
      };

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(adaptedData),
        signal: AbortSignal.timeout(platform.timeout)
      });

      const responseTime = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        return {
          platform: platform.name,
          success: false,
          error: `HTTP ${response.status}: ${errorText}`,
          responseTime,
          statusCode: response.status
        };
      }

      return {
        platform: platform.name,
        success: true,
        responseTime,
        statusCode: response.status
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        platform: platform.name,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime
      };
    }
  }

  private async retryRequest(
    platform: SyncPlatform,
    endpoint: 'create' | 'update' | 'delete',
    userData: UserData | UserDeleteData,
    attempt: number = 1
  ): Promise<SyncResult> {
    const result = await this.makeSyncRequest(platform, endpoint, userData);
    
    if (result.success || attempt >= platform.retryPolicy.maxAttempts) {
      return result;
    }

    // Exponential backoff
    const delay = platform.retryPolicy.initialDelayMs * 
                  Math.pow(platform.retryPolicy.backoffMultiplier, attempt - 1);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return this.retryRequest(platform, endpoint, userData, attempt + 1);
  }

  private log(message: string, level: string = 'info') {
    if (this.config.global.enableLogging) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${level.toUpperCase()}] [SYNC] ${message}`);
    }
  }

  async syncUserCreate(userData: UserData): Promise<SyncResult[]> {
    const enabledPlatforms = this.getEnabledPlatforms();
    
    if (enabledPlatforms.length === 0) {
      this.log('No enabled platforms found for sync', 'warn');
      return [];
    }

    this.log(`Starting user create sync to ${enabledPlatforms.length} platforms`);
    
    const syncPromises = enabledPlatforms.map(platform => 
      this.retryRequest(platform, 'create', userData)
    );

    const results = await Promise.allSettled(syncPromises);
    
    const syncResults: SyncResult[] = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          platform: enabledPlatforms[index].name,
          success: false,
          error: result.reason?.message || 'Promise rejected'
        };
      }
    });

    // Log results
    const successful = syncResults.filter(r => r.success);
    const failed = syncResults.filter(r => !r.success);
    
    this.log(`User create sync completed: ${successful.length} successful, ${failed.length} failed`);
    
    failed.forEach(result => {
      this.log(`Failed to sync to ${result.platform}: ${result.error}`, 'error');
    });

    return syncResults;
  }

  async syncUserUpdate(userData: UserData): Promise<SyncResult[]> {
    const enabledPlatforms = this.getEnabledPlatforms();
    
    if (enabledPlatforms.length === 0) {
      this.log('No enabled platforms found for sync', 'warn');
      return [];
    }

    this.log(`Starting user update sync to ${enabledPlatforms.length} platforms`);
    
    const syncPromises = enabledPlatforms.map(platform => 
      this.retryRequest(platform, 'update', userData)
    );

    const results = await Promise.allSettled(syncPromises);
    
    const syncResults: SyncResult[] = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          platform: enabledPlatforms[index].name,
          success: false,
          error: result.reason?.message || 'Promise rejected'
        };
      }
    });

    // Log results
    const successful = syncResults.filter(r => r.success);
    const failed = syncResults.filter(r => !r.success);
    
    this.log(`User update sync completed: ${successful.length} successful, ${failed.length} failed`);
    
    failed.forEach(result => {
      this.log(`Failed to sync to ${result.platform}: ${result.error}`, 'error');
    });

    return syncResults;
  }

  async syncUserDelete(userData: UserDeleteData): Promise<SyncResult[]> {
    const enabledPlatforms = this.getEnabledPlatforms();
    
    if (enabledPlatforms.length === 0) {
      this.log('No enabled platforms found for sync', 'warn');
      return [];
    }

    this.log(`Starting user delete sync to ${enabledPlatforms.length} platforms`);
    
    const syncPromises = enabledPlatforms.map(platform => 
      this.retryRequest(platform, 'delete', userData)
    );

    const results = await Promise.allSettled(syncPromises);
    
    const syncResults: SyncResult[] = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          platform: enabledPlatforms[index].name,
          success: false,
          error: result.reason?.message || 'Promise rejected'
        };
      }
    });

    // Log results
    const successful = syncResults.filter(r => r.success);
    const failed = syncResults.filter(r => !r.success);
    
    this.log(`User delete sync completed: ${successful.length} successful, ${failed.length} failed`);
    
    failed.forEach(result => {
      this.log(`Failed to sync to ${result.platform}: ${result.error}`, 'error');
    });

    return syncResults;
  }

  async testPlatformConnections(): Promise<SyncResult[]> {
    const enabledPlatforms = this.getEnabledPlatforms();
    
    if (enabledPlatforms.length === 0) {
      this.log('No enabled platforms found for testing', 'warn');
      return [];
    }

    this.log(`Testing connections to ${enabledPlatforms.length} platforms`);
    
    const testPromises = enabledPlatforms.map(async (platform) => {
      const startTime = Date.now();
      
      try {
        const { baseUrl, apiKey } = this.getPlatformConfig(platform);
        const url = `${baseUrl}${platform.endpoints.test}`;
        
        const headers = {
          ...platform.headers,
          'X-API-Key': apiKey,
          'User-Agent': 'AabPashi-Sync/1.0'
        };

        const response = await fetch(url, {
          method: 'GET',
          headers,
          signal: AbortSignal.timeout(platform.timeout)
        });

        const responseTime = Date.now() - startTime;

        return {
          platform: platform.name,
          success: response.ok,
          error: response.ok ? undefined : `HTTP ${response.status}`,
          responseTime,
          statusCode: response.status
        };

      } catch (error) {
        const responseTime = Date.now() - startTime;
        return {
          platform: platform.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          responseTime
        };
      }
    });

    const results = await Promise.allSettled(testPromises);
    
    const testResults: SyncResult[] = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          platform: enabledPlatforms[index].name,
          success: false,
          error: result.reason?.message || 'Promise rejected'
        };
      }
    });

    // Log results
    const successful = testResults.filter(r => r.success);
    const failed = testResults.filter(r => !r.success);
    
    this.log(`Connection test completed: ${successful.length} successful, ${failed.length} failed`);
    
    failed.forEach(result => {
      this.log(`Failed to connect to ${result.platform}: ${result.error}`, 'error');
    });

    return testResults;
  }

  getPlatformStatus(): { name: string; enabled: boolean; configured: boolean }[] {
    return this.config.platforms.map(platform => ({
      name: platform.name,
      enabled: platform.enabled,
      configured: !!(process.env[platform.apiKeyEnvVar] && process.env[platform.baseUrlEnvVar])
    }));
  }
}

// Create singleton instance
const multiPlatformSync = new MultiPlatformSync();

// Export functions for backward compatibility
export const syncUserCreate = (userData: UserData) => multiPlatformSync.syncUserCreate(userData);
export const syncUserUpdate = (userData: UserData) => multiPlatformSync.syncUserUpdate(userData);
export const syncUserDelete = (userData: UserDeleteData) => multiPlatformSync.syncUserDelete(userData);

// Export new functions
export const testPlatformConnections = () => multiPlatformSync.testPlatformConnections();
export const getPlatformStatus = () => multiPlatformSync.getPlatformStatus();

// Export types
export type { SyncResult, UserData, UserDeleteData, SyncPlatform }; 