// app/api/getfields/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserId, isApiKeyAuth, hasApiKeyPermission } from "@/lib/auth-utils";
const connectToDatabase = require("@/lib/db");

// Named export for the POST method
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { userId } = body; // Get userId from the request body (POST request)
    
    // If no userId provided in body, try to get it from authentication
    if (!userId) {
      userId = getUserId(req);
    }
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    // For API key authentication, check if user has permission to access this user's data
    if (isApiKeyAuth(req)) {
      const apiKeyUserId = req.headers.get('x-api-key-user-id');
      // If API key is associated with a specific user, only allow access to that user's data
      if (apiKeyUserId && apiKeyUserId !== userId) {
        return NextResponse.json({ error: "Forbidden - Cannot access other user's data." }, { status: 403 });
      }
      // If API key has admin permissions, allow access to any user's data
      if (!hasApiKeyPermission(req, 'admin')) {
        return NextResponse.json({ error: "Forbidden - Insufficient permissions." }, { status: 403 });
      }
    }

    const client = await connectToDatabase();
    const db = client.db("WaterVation"); // Replace with your database name
    const fieldsCollection = db.collection("Fields"); // Assuming you have a collection called "Fields"

    // Fetch the fields related to the userId
    const fields = await fieldsCollection.find({ userId }).toArray();

    // Send the fields back as a JSON response
    return NextResponse.json({ fields }, { status: 200 });
  } catch (error) {
    console.error("Error fetching fields:", error);
    return NextResponse.json({ error: "Failed to fetch fields" }, { status: 500 });
  }
}
