// app/api/getfields/route.ts
import { NextRequest, NextResponse } from "next/server";
const connectToDatabase = require("@/lib/db");

// Named export for the POST method
export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json(); // Get userId from the request body (POST request)
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
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
