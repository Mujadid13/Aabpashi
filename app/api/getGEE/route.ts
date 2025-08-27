import { NextRequest, NextResponse } from "next/server";

const GEEApiUrl = process.env.NEXT_PUBLIC_GEE_API_URL || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { polygon } = body;

    if (!polygon) {
      return NextResponse.json(
        { error: "Polygon is required in the request body." },
        { status: 400 }
      );
    }

    // 🔁 Forward request to Dockerized GEE API
    const response = await fetch(GEEApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ polygon }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error || "Error from GEE API" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error("Error proxying to GEE API:", error.message);
    return NextResponse.json(
      { error: "Failed to contact GEE Docker API." },
      { status: 500 }
    );
  }
}
