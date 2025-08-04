import { NextResponse, NextRequest } from "next/server";
const connectToDatabase = require("@/lib/db");
import { parse } from "json2csv";

const pythonApiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL1 || ""; // DigitalOcean API URL

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Assigning canal name and division correctly
    const canal_name = body.canal;
    const division = body.division; // Fixed typo here

    if (!canal_name) {
      return NextResponse.json({ error: "Canal is missing" }, { status: 400 });
    }

    if (!division) {
      return NextResponse.json(
        { error: "Division is missing" },
        { status: 400 }
      );
    }

    const canals_RP = `${division}_Canal_RP`;
    const rotation = `${division}_RP`;
    const canals = `${division}_Canals`;


    const client = await connectToDatabase();
    const db = client.db("WaterVation");
    const idk = db.collection(canals_RP);
    const idk1 = db.collection(rotation);
    const idk2 = db.collection(canals);

    const files = await idk.find({}, { projection: { _id: 0 } }).toArray();
    const files1 = await idk1.find({}, { projection: { _id: 0 } }).toArray();
    const files2 = await idk2.find({}, { projection: { _id: 0 } }).toArray();


    let priority_csv_content = parse(files);
    let rotation_csv_content = parse(files1);
    let hierarchy_csv_content = parse(files2);

    // Remove all quotes from the final CSV content
    const priority_csv = priority_csv_content.replace(/"/g, "");
    const rotation_csv = rotation_csv_content.replace(/"/g, "");
    const hierarchy_csv = hierarchy_csv_content.replace(/"/g, "");

    const data = {
      canal_name: canal_name,
      priority_csv,
      rotation_csv,
      hierarchy_csv,
    };

    // ✅ Forward request to Python API (DigitalOcean)
    const response = await fetch(pythonApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    // ✅ Parse JSON response from Python API
    const result = await response.json();

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ Error connecting to Python API:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend", details: error.message },
      { status: 500 }
    );
  }
}
