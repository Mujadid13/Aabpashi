import { NextRequest, NextResponse } from "next/server";
const connectToDatabase = require("@/lib/db");

function sanitizeInput(input: string): string {
  return typeof input === "string" ? input.replace(/[$.]/g, "").trim() : input;
}

function capitalizeWords(str: string) {
  return str
    .split(' ') 
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
    .join(' '); 
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { fieldName, cropTypes, soilType, location, userId } = body;

    fieldName = sanitizeInput(fieldName);

    fieldName = capitalizeWords(fieldName);

    if (
      !fieldName ||
      !Array.isArray(cropTypes) ||
      cropTypes.length === 0 ||
      !soilType ||
      !location ||
      !userId
    ) {
      return NextResponse.json(
        {
          error:
            "All fields (fieldName, cropTypes, soilType, and geometry) are required",
        },
        { status: 400 }
      );
    }

    // ✅ Validate location format
    if (typeof location.lat !== "number" || typeof location.lng !== "number") {
      return NextResponse.json(
        {
          error:
            "Invalid location format. Expected { lat: number, lng: number }.",
        },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const dbName = "WaterVation";
    const database = client.db(dbName);
    const collection = database.collection("Fields");

    const newField = {
      fieldName,
      cropTypes,
      soilType,
      location,
      userId,
      createdAt: new Date(),
    };

    await collection.insertOne(newField);

    return NextResponse.json(
      { message: "Field data saved successfully", data: newField },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving field data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
