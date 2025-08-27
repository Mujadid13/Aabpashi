import { UserData, UserDeleteData } from './sync-multi';

// Base interface for platform-specific field mappings
interface FieldMapper {
  name: string;
  displayName: string;
  adaptUserData: (userData: UserData, sourcePlatform: string) => any;
  adaptUserUpdate: (userData: Partial<UserData>, sourcePlatform: string) => any;
  adaptUserDelete: (userData: UserDeleteData, sourcePlatform: string) => any;
}

// Farmovation User Server field mapper
const farmovationMapper: FieldMapper = {
  name: 'farmovation',
  displayName: 'Farmovation User Server',
  
  adaptUserData: (userData: UserData, sourcePlatform: string) => {
    // Split name into firstName and lastName
    const nameParts = userData.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Extract phone prefix and number
    const phoneWithPrefix = userData.phone;
    const phoneWithoutPrefix = userData.phone.replace(/[^0-9]/g, '');
    const phonePrefix = phoneWithPrefix.startsWith('+') ? phoneWithPrefix.substring(0, 3) : '+92';
    
    // Extract mobile number without country code
    let mobileNumber = phoneWithoutPrefix;
    if (phoneWithoutPrefix.startsWith('92') && phoneWithoutPrefix.length > 10) {
      mobileNumber = phoneWithoutPrefix.substring(2); // Remove 92 prefix
    }
    
    return {
      userData: {
        email: `${mobileNumber}@aabpashi.com`, // Generate email from mobile number
        mobile: mobileNumber, // Mobile number without country code
        phone: phoneWithPrefix, // Full phone number with prefix
        phone_prefix: phonePrefix, // Phone prefix (+92)
        first_name: firstName,
        last_name: lastName,
        // Additional fields that might be useful for Farmovation
        country_code: 'PK',
        mobile_operator: userData.receiverNetwork,
        source_platform: sourcePlatform
      },
      originalId: userData._id || `aabpashi-${mobileNumber}`,
      operation: "create",
      timestamp: new Date().toISOString()
    };
  },
  
  adaptUserUpdate: (userData: Partial<UserData>, sourcePlatform: string) => {
    const updateData: any = {};
    
    if (userData.name) {
      const nameParts = userData.name.trim().split(' ');
      updateData.first_name = nameParts[0] || '';
      updateData.last_name = nameParts.slice(1).join(' ') || '';
    }
    
    if (userData.phone) {
      const phoneWithPrefix = userData.phone;
      const phoneWithoutPrefix = userData.phone.replace(/[^0-9]/g, '');
      const phonePrefix = phoneWithPrefix.startsWith('+') ? phoneWithPrefix.substring(0, 3) : '+92';
      
      // Extract mobile number without country code
      let mobileNumber = phoneWithoutPrefix;
      if (phoneWithoutPrefix.startsWith('92') && phoneWithoutPrefix.length > 10) {
        mobileNumber = phoneWithoutPrefix.substring(2); // Remove 92 prefix
      }
      
      updateData.mobile = mobileNumber;
      updateData.phone = phoneWithPrefix;
      updateData.phone_prefix = phonePrefix;
    }
    
    if ('email' in userData && userData.email) {
      updateData.email = userData.email;
    }
    
    if (userData.receiverNetwork) {
      updateData.mobile_operator = userData.receiverNetwork;
    }
    
    return {
      userData: updateData,
      originalId: userData._id || `aabpashi-${userData.phone?.replace(/[^0-9]/g, '').replace(/^92/, '') || 'unknown'}`,
      operation: "update",
      timestamp: new Date().toISOString()
    };
  },
  
  adaptUserDelete: (userData: UserDeleteData, sourcePlatform: string) => {
    const phoneWithoutPrefix = userData.phone.replace(/[^0-9]/g, '');
    let mobileNumber = phoneWithoutPrefix;
    if (phoneWithoutPrefix.startsWith('92') && phoneWithoutPrefix.length > 10) {
      mobileNumber = phoneWithoutPrefix.substring(2); // Remove 92 prefix
    }
    
    return {
      originalId: userData._id || `aabpashi-${mobileNumber}`,
      verificationData: {
        email: `${mobileNumber}@aabpashi.com`,
        phone: userData.phone,
        mobile: mobileNumber
      }
    };
  }
};

// Farmovation Marketplace Platform field mapper
const farmovationMarketplaceMapper: FieldMapper = {
  name: 'farmovation_marketplace',
  displayName: 'Farmovation Marketplace Platform',
  
  adaptUserData: (userData: UserData, sourcePlatform: string) => {
    // Split name into firstName and lastName
    const nameParts = userData.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Extract phone prefix and number
    const phoneWithPrefix = userData.phone;
    const phoneWithoutPrefix = userData.phone.replace(/[^0-9]/g, '');
    const phonePrefix = phoneWithPrefix.startsWith('+') ? phoneWithPrefix.substring(0, 3) : '+92';
    
    // Extract mobile number without country code
    let mobileNumber = phoneWithoutPrefix;
    if (phoneWithoutPrefix.startsWith('92') && phoneWithoutPrefix.length > 10) {
      mobileNumber = phoneWithoutPrefix.substring(2); // Remove 92 prefix
    }
    
    return {
      seller: {
        sellerId: userData._id,
        profile: {
          firstName: firstName,
          lastName: lastName,
          fullName: userData.name,
          email: `${mobileNumber}@aabpashi.com`,
          phone: phoneWithPrefix, // Full phone number with prefix
          phone_prefix: phonePrefix, // Phone prefix (+92)
          mobile: mobileNumber, // Mobile number without country code
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
  },
  
  adaptUserUpdate: (userData: Partial<UserData>, sourcePlatform: string) => {
    const updateData: any = {};
    
    if (userData.name) {
      const nameParts = userData.name.trim().split(' ');
      updateData.profile = {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        fullName: userData.name,
        businessName: `${userData.name} Farm`
      };
    }
    
    if (userData.city || userData.division) {
      updateData.location = {
        city: userData.city,
        state: userData.division,
        country: userData.country,
        address: `${userData.city || ''}, ${userData.division || ''}, ${userData.country || ''}`
      };
    }
    
    if (userData.role) {
      updateData.profile = { 
        ...updateData.profile,
        businessType: userData.role.toLowerCase(),
        specializations: [userData.role]
      };
    }
    
    if (userData.farmsize) {
      updateData.businessDetails = { farmSize: userData.farmsize };
    }
    
    updateData.integration = {
      sourcePlatform: sourcePlatform,
      lastUpdatedAt: new Date().toISOString(),
      syncVersion: "1.0"
    };
    
    return { seller: updateData };
  },
  
  adaptUserDelete: (userData: UserDeleteData, sourcePlatform: string) => {
    return {
      sellerId: userData._id,
      phone: userData.phone,
      marketplace: {
        status: "deactivated",
        deactivationReason: "User deleted from source platform"
      },
      integration: {
        sourcePlatform: sourcePlatform,
        deactivatedAt: new Date().toISOString(),
        syncVersion: "1.0"
      }
    };
  }
};

// Generic/default mapper for unknown platforms
const genericMapper: FieldMapper = {
  name: 'generic',
  displayName: 'Generic Platform',
  
  adaptUserData: (userData: UserData, sourcePlatform: string) => {
    // Extract phone prefix and number
    const phoneWithPrefix = userData.phone;
    const phoneWithoutPrefix = userData.phone.replace(/[^0-9]/g, '');
    const phonePrefix = phoneWithPrefix.startsWith('+') ? phoneWithPrefix.substring(0, 3) : '+92';
    
    // Extract mobile number without country code
    let mobileNumber = phoneWithoutPrefix;
    if (phoneWithoutPrefix.startsWith('92') && phoneWithoutPrefix.length > 10) {
      mobileNumber = phoneWithoutPrefix.substring(2); // Remove 92 prefix
    }
    
    return {
      user: {
        id: userData._id,
        name: userData.name,
        phone: phoneWithPrefix, // Full phone number with prefix
        phone_prefix: phonePrefix, // Phone prefix (+92)
        mobile: mobileNumber, // Mobile number without country code
        email: `${mobileNumber}@aabpashi.com`,
        city: userData.city,
        division: userData.division,
        country: userData.country,
        role: userData.role,
        farmsize: userData.farmsize,
        receiverNetwork: userData.receiverNetwork,
        sourcePlatform: sourcePlatform,
        originalId: userData._id,
        createdAt: userData.createdAt
      }
    };
  },
  
  adaptUserUpdate: (userData: Partial<UserData>, sourcePlatform: string) => {
    return {
      user: {
        ...userData,
        sourcePlatform: sourcePlatform,
        lastUpdatedAt: new Date().toISOString()
      }
    };
  },
  
  adaptUserDelete: (userData: UserDeleteData, sourcePlatform: string) => {
    return {
      userId: userData._id,
      phone: userData.phone,
      sourcePlatform: sourcePlatform,
      deletedAt: new Date().toISOString()
    };
  }
};

// Registry of all field mappers
const fieldMappers: Record<string, FieldMapper> = {
  farmovation: farmovationMapper,
  farmovation_marketplace: farmovationMarketplaceMapper,
  generic: genericMapper
};

// Main field mapping service
export class SyncFieldMapper {
  private static instance: SyncFieldMapper;
  private mappers: Record<string, FieldMapper>;

  private constructor() {
    this.mappers = fieldMappers;
  }

  static getInstance(): SyncFieldMapper {
    if (!SyncFieldMapper.instance) {
      SyncFieldMapper.instance = new SyncFieldMapper();
    }
    return SyncFieldMapper.instance;
  }

  /**
   * Get the appropriate field mapper for a platform
   */
  getMapper(platformName: string): FieldMapper {
    return this.mappers[platformName] || this.mappers.generic;
  }

  /**
   * Adapt user data for a specific platform
   */
  adaptUserData(platformName: string, userData: UserData, sourcePlatform: string = 'aabpashi'): any {
    const mapper = this.getMapper(platformName);
    return mapper.adaptUserData(userData, sourcePlatform);
  }

  /**
   * Adapt user update data for a specific platform
   */
  adaptUserUpdate(platformName: string, userData: Partial<UserData>, sourcePlatform: string = 'aabpashi'): any {
    const mapper = this.getMapper(platformName);
    return mapper.adaptUserUpdate(userData, sourcePlatform);
  }

  /**
   * Adapt user delete data for a specific platform
   */
  adaptUserDelete(platformName: string, userData: UserDeleteData, sourcePlatform: string = 'aabpashi'): any {
    const mapper = this.getMapper(platformName);
    return mapper.adaptUserDelete(userData, sourcePlatform);
  }

  /**
   * Get all available mappers
   */
  getAvailableMappers(): string[] {
    return Object.keys(this.mappers);
  }

  /**
   * Add a custom field mapper
   */
  addMapper(platformName: string, mapper: FieldMapper): void {
    this.mappers[platformName] = mapper;
  }

  /**
   * Remove a field mapper
   */
  removeMapper(platformName: string): void {
    if (platformName !== 'generic') {
      delete this.mappers[platformName];
    }
  }
}

// Export singleton instance
export const syncFieldMapper = SyncFieldMapper.getInstance();

// Export types
export type { FieldMapper }; 