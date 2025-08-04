import { NextRequest, NextResponse } from "next/server";
const connectToDatabase = require("@/lib/db");
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const { fieldId } = await req.json();

    if (!fieldId) {
      return NextResponse.json({ error: "Missing fieldId" }, { status: 400 });
    }

    const client = await connectToDatabase();
    const db = client.db("WaterVation");
    const collection = db.collection("Fields");
    const field = await collection.findOne({ _id: new ObjectId(fieldId) });

    if (!field) {
      return NextResponse.json({ error: "Field not found" }, { status: 404 });
    }

    return NextResponse.json({ polygon: field.polygon, fieldName: field.fieldName }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
