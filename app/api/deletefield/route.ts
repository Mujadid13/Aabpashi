import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
const connectToDatabase = require("@/lib/db");

export async function POST(req: NextRequest) {
  try {
    const { _id } = await req.json();

    if (!_id) {
      return NextResponse.json({ error: "Field _id is required." }, { status: 400 });
    }

    const client = await connectToDatabase();
    const collection = client.db("WaterVation").collection("Fields");

    const result = await collection.deleteOne({ _id: new ObjectId(_id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "No matching field found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Field deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting field:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
