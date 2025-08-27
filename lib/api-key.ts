import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import crypto from 'crypto';

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  userId?: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  expiresAt?: string;
}

export interface CreateApiKeyRequest {
  name: string;
  userId?: string;
  permissions?: string[];
  expiresInDays?: number;
}

export interface UpdateApiKeyRequest {
  name?: string;
  permissions?: string[];
  isActive?: boolean;
  expiresInDays?: number;
}

class ApiKeyService {
  private readonly filePath: string;
  private readonly keysDir: string;

  constructor() {
    this.keysDir = join(process.cwd(), 'data', 'api-keys');
    this.filePath = join(this.keysDir, 'api-keys.json');
    this.ensureDirectoryExists();
  }

  private ensureDirectoryExists(): void {
    if (!existsSync(this.keysDir)) {
      mkdirSync(this.keysDir, { recursive: true });
    }
  }

  private readApiKeys(): ApiKey[] {
    try {
      if (!existsSync(this.filePath)) {
        return [];
      }
      const data = readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading API keys file:', error);
      return [];
    }
  }

  private writeApiKeys(apiKeys: ApiKey[]): void {
    try {
      writeFileSync(this.filePath, JSON.stringify(apiKeys, null, 2), 'utf8');
    } catch (error) {
      console.error('Error writing API keys file:', error);
      throw new Error('Failed to save API key');
    }
  }

  private generateApiKey(): string {
    return `aabpashi_${crypto.randomBytes(32).toString('hex')}`;
  }

  private generateId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  async createApiKey(request: CreateApiKeyRequest): Promise<ApiKey> {
    const apiKeys = this.readApiKeys();
    
    // Check if name already exists
    const existingKey = apiKeys.find(key => key.name === request.name);
    if (existingKey) {
      throw new Error('API key with this name already exists');
    }

    const now = new Date().toISOString();
    const expiresAt = request.expiresInDays 
      ? new Date(Date.now() + request.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
      : undefined;

    const newApiKey: ApiKey = {
      id: this.generateId(),
      name: request.name,
      key: this.generateApiKey(),
      userId: request.userId,
      permissions: request.permissions || ['read'],
      isActive: true,
      createdAt: now,
      expiresAt
    };

    apiKeys.push(newApiKey);
    this.writeApiKeys(apiKeys);

    return newApiKey;
  }

  async getApiKey(key: string): Promise<ApiKey | null> {
    const apiKeys = this.readApiKeys();
    return apiKeys.find(apiKey => apiKey.key === key && apiKey.isActive) || null;
  }

  async getApiKeyById(id: string): Promise<ApiKey | null> {
    const apiKeys = this.readApiKeys();
    return apiKeys.find(apiKey => apiKey.id === id) || null;
  }

  async getAllApiKeys(): Promise<ApiKey[]> {
    return this.readApiKeys();
  }

  async updateApiKey(id: string, updates: UpdateApiKeyRequest): Promise<ApiKey> {
    const apiKeys = this.readApiKeys();
    const keyIndex = apiKeys.findIndex(key => key.id === id);
    
    if (keyIndex === -1) {
      throw new Error('API key not found');
    }

    const updatedKey = { ...apiKeys[keyIndex] };

    if (updates.name !== undefined) {
      // Check if new name conflicts with existing keys
      const nameConflict = apiKeys.find(key => key.name === updates.name && key.id !== id);
      if (nameConflict) {
        throw new Error('API key with this name already exists');
      }
      updatedKey.name = updates.name;
    }

    if (updates.permissions !== undefined) {
      updatedKey.permissions = updates.permissions;
    }

    if (updates.isActive !== undefined) {
      updatedKey.isActive = updates.isActive;
    }

    if (updates.expiresInDays !== undefined) {
      updatedKey.expiresAt = updates.expiresInDays > 0
        ? new Date(Date.now() + updates.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
        : undefined;
    }

    apiKeys[keyIndex] = updatedKey;
    this.writeApiKeys(apiKeys);

    return updatedKey;
  }

  async deleteApiKey(id: string): Promise<void> {
    const apiKeys = this.readApiKeys();
    const filteredKeys = apiKeys.filter(key => key.id !== id);
    
    if (filteredKeys.length === apiKeys.length) {
      throw new Error('API key not found');
    }

    this.writeApiKeys(filteredKeys);
  }

  async validateApiKey(key: string): Promise<{ isValid: boolean; apiKey?: ApiKey; error?: string }> {
    try {
      const apiKey = await this.getApiKey(key);
      
      if (!apiKey) {
        return { isValid: false, error: 'Invalid API key' };
      }

      if (!apiKey.isActive) {
        return { isValid: false, error: 'API key is inactive' };
      }

      if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
        return { isValid: false, error: 'API key has expired' };
      }

      // Update last used timestamp
      await this.updateApiKey(apiKey.id, {});
      const updatedKey = await this.getApiKeyById(apiKey.id);
      if (updatedKey) {
        updatedKey.lastUsed = new Date().toISOString();
        await this.updateApiKey(apiKey.id, {});
      }

      return { isValid: true, apiKey };
    } catch (error) {
      return { isValid: false, error: 'Error validating API key' };
    }
  }

  async checkPermission(key: string, permission: string): Promise<boolean> {
    const validation = await this.validateApiKey(key);
    if (!validation.isValid || !validation.apiKey) {
      return false;
    }

    return validation.apiKey.permissions.includes(permission) || 
           validation.apiKey.permissions.includes('admin');
  }

  async revokeApiKey(id: string): Promise<void> {
    await this.updateApiKey(id, { isActive: false });
  }

  async regenerateApiKey(id: string): Promise<ApiKey> {
    const apiKey = await this.getApiKeyById(id);
    if (!apiKey) {
      throw new Error('API key not found');
    }

    const newKey = this.generateApiKey();
    const updatedKey = await this.updateApiKey(id, {});
    updatedKey.key = newKey;

    // Update the key in the file
    const apiKeys = this.readApiKeys();
    const keyIndex = apiKeys.findIndex(key => key.id === id);
    if (keyIndex !== -1) {
      apiKeys[keyIndex] = updatedKey;
      this.writeApiKeys(apiKeys);
    }

    return updatedKey;
  }
}

export const apiKeyService = new ApiKeyService(); 