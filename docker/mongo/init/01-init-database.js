// MongoDB initialization script for AabPashi
// This script runs when the MongoDB container starts for the first time

// Switch to the aabpashi database
db = db.getSiblingDB('aabpashi');

// Create collections with proper indexes
print('Creating collections and indexes for AabPashi...');

// Users collection
db.createCollection('users');
db.users.createIndex({ "phone": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { sparse: true });
db.users.createIndex({ "division": 1 });
db.users.createIndex({ "createdAt": -1 });

// Fields collection
db.createCollection('fields');
db.fields.createIndex({ "userId": 1 });
db.fields.createIndex({ "location": "2dsphere" });
db.fields.createIndex({ "createdAt": -1 });

// Contact collection
db.createCollection('contact');
db.contact.createIndex({ "createdAt": -1 });

// API Keys collection
db.createCollection('api_keys');
db.api_keys.createIndex({ "key": 1 }, { unique: true });
db.api_keys.createIndex({ "userId": 1 });
db.api_keys.createIndex({ "isActive": 1 });
db.api_keys.createIndex({ "expiresAt": 1 });

// Division-specific collections
const divisions = ['Kasur', 'RYK', 'Other'];

divisions.forEach(division => {
    // Canals collection for each division
    db.createCollection(`${division}_Canals`);
    db[`${division}_Canals`].createIndex({ "name": 1 });
    
    // Canal priority collection for each division
    db.createCollection(`${division}_Canal_RP`);
    db[`${division}_Canal_RP`].createIndex({ "canal": 1 });
    
    // Rotation schedule collection for each division
    db.createCollection(`${division}_RP`);
    db[`${division}_RP`].createIndex({ "canal": 1 });
    
    // Shapefile collection for each division
    db.createCollection(`${division}_shp`);
    db[`${division}_shp`].createIndex({ "geometry": "2dsphere" });
});

// Create a user for testing (optional)
const testUser = {
    _id: ObjectId(),
    name: "Test User",
    phone: "+923001234567",
    city: "Lahore",
    division: "Kasur",
    role: "Farmer",
    farmsize: "5-10 acres",
    country: "Pakistan",
    receiverNetwork: "Jazz",
    createdAt: new Date(),
    updatedAt: new Date()
};

// Insert test user if it doesn't exist
if (db.users.countDocuments({ phone: testUser.phone }) === 0) {
    db.users.insertOne(testUser);
    print('Test user created successfully');
} else {
    print('Test user already exists');
}

// Create a test API key (optional)
const testApiKey = {
    _id: ObjectId(),
    name: "Test API Key",
    key: "aabpashi_test_1234567890abcdef",
    userId: testUser._id,
    permissions: ["read", "write"],
    isActive: true,
    createdAt: new Date(),
    lastUsed: null,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
};

// Insert test API key if it doesn't exist
if (db.api_keys.countDocuments({ key: testApiKey.key }) === 0) {
    db.api_keys.insertOne(testApiKey);
    print('Test API key created successfully');
} else {
    print('Test API key already exists');
}

print('MongoDB initialization completed successfully!');
print('Collections created: users, fields, contact, api_keys');
print('Division collections created for: ' + divisions.join(', ')); 