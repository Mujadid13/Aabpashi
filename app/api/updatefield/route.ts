import { NextRequest, NextResponse } from "next/server";
const connectToDatabase = require("@/lib/db");
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fieldId, polygon } = body;

    if (!fieldId || !polygon) {
      return NextResponse.json(
        { error: "fieldId and polygon are required." },
        { status: 400 }
      );
    }

    if (
      !polygon.type ||
      polygon.type !== "Polygon" ||
      !Array.isArray(polygon.coordinates)
    ) {
      return NextResponse.json(
        { error: "Invalid GeoJSON polygon format." },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db("WaterVation");
    const collection = db.collection("Fields");

    const result = await collection.updateOne(
      { _id: new ObjectId(fieldId) },
      { $set: { polygon } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Field not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Polygon updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating polygon:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
