const { MongoClient } = require("mongodb");

const connectToDatabase = async () => {
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
        throw new Error("MONGO_URI is not defined in the environment variables");
    }

    const options = {
        connectTimeoutMS: 30000, 
        serverSelectionTimeoutMS: 30000, 
    };

    const client = new MongoClient(uri, options);

    try {
        await client.connect();
        console.log("Connected to MongoDB server");
        return client; 
    } catch (error: unknown) {
        const err = error as any;

        console.error("Connection error:", err.message);

        console.error("Error Details:", {
            code: err.code,
            name: err.name,
            reason: err.reason,
        });

        throw err; 
    }
};

module.exports = connectToDatabase;
