import { NextRequest, NextResponse } from "next/server";
const connectToDatabase = require("@/lib/db");

// Named export for the POST method
export async function POST(req: NextRequest) {
  try {
    // Extract division from the request body
    const body = await req.json();

    const division = body.division;

    if (!division) {
      return NextResponse.json({ error: "Division parameter is required" }, { status: 400 });
    }

    const division_canals = `${division}_Canals`;

    const client = await connectToDatabase();
    const db = client.db("WaterVation"); 
    const canalCollection = db.collection(division_canals); 

    // Fetch the canals related to the division
    const canals = await canalCollection.find({}).toArray();

    // Send the canals back as a JSON response
    return NextResponse.json(canals, { status: 200 });
  } catch (error) {
    console.error("Error fetching fields:", error);
    return NextResponse.json({ error: "Failed to fetch fields" }, { status: 500 });
  }
}
