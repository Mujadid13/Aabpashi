import { NextResponse, NextRequest } from "next/server";
const connectToDatabase = require("@/lib/db");

const pythonApiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || ""; // DigitalOcean API URL

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Get request body
    const position = body.position;
    const division = body.division;

    if (!position) {
      return NextResponse.json(
        { error: "Position is required" },
        { status: 400 }
      );
    }

    if (!division) {
      return NextResponse.json(
        { error: "Division is required" },
        { status: 400 }
      );
    }

    const { lon, lat } = position;
    const division_shp = `${division}_shp`;

    const client = await connectToDatabase();
    const db = client.db("WaterVation"); // Replace with your database name
    const canalCollection = db.collection(division_shp); // Assuming you have a collection called "Fields"

    // Retrieve all files from the collection
    const files = await canalCollection
      .find({}, { projection: { filename: 1, file_data: 1, _id: 0 } })
      .toArray();

    if (files.length === 0) {
      return NextResponse.json(
        { error: "No files found in the database for the given division" },
        { status: 404 }
      );
    }

    let divisions_shp,
      divisions_shx,
      divisions_dbf,
      divisions_prj,
      divisions_cpg;
    let divisions_sbn, divisions_sbx, network_shp, network_shx, network_dbf;
    let network_prj, network_cpg, network_sbn, network_sbx;

    // Iterate through files and assign them directly to variables based on the filename
    files.forEach((file: { filename: string; file_data: any }) => {
      const base64Content = file.file_data.toString("base64");
      const filename = file.filename;

      // Use template literals to dynamically match the filenames
      if (filename === `Divisions_${division}_Area.shp`)
        divisions_shp = { filename, content: base64Content };
      if (filename === `Divisions_${division}_Area.shx`)
        divisions_shx = { filename, content: base64Content };
      if (filename === `Divisions_${division}_Area.dbf`)
        divisions_dbf = { filename, content: base64Content };
      if (filename === `Divisions_${division}_Area.prj`)
        divisions_prj = { filename, content: base64Content };
      if (filename === `Divisions_${division}_Area.cpg`)
        divisions_cpg = { filename, content: base64Content };
      if (filename === `Divisions_${division}_Area.sbn`)
        divisions_sbn = { filename, content: base64Content };
      if (filename === `Divisions_${division}_Area.sbx`)
        divisions_sbx = { filename, content: base64Content };
      if (filename === `Irrigation_Network_${division}_area.shp`)
        network_shp = { filename, content: base64Content };
      if (filename === `Irrigation_Network_${division}_area.shx`)
        network_shx = { filename, content: base64Content };
      if (filename === `Irrigation_Network_${division}_area.dbf`)
        network_dbf = { filename, content: base64Content };
      if (filename === `Irrigation_Network_${division}_area.prj`)
        network_prj = { filename, content: base64Content };
      if (filename === `Irrigation_Network_${division}_area.cpg`)
        network_cpg = { filename, content: base64Content };
      if (filename === `Irrigation_Network_${division}_area.sbn`)
        network_sbn = { filename, content: base64Content };
      if (filename === `Irrigation_Network_${division}_area.sbx`)
        network_sbx = { filename, content: base64Content };
    });

    // Prepare the data object similar to the desired structure
    const data = {
      lon,
      lat,
      divisions_shp,
      divisions_shx,
      divisions_dbf,
      divisions_prj,
      divisions_cpg,
      divisions_sbn,
      divisions_sbx,
      network_shp,
      network_shx,
      network_dbf,
      network_prj,
      network_cpg,
      network_sbn,
      network_sbx,
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
