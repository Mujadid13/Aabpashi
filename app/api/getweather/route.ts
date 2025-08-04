// app/api/getweather/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const position = body.position;

    if (!position || typeof position.lat !== "number" || typeof position.lon !== "number") {
      return NextResponse.json({ error: "Invalid position format" }, { status: 400 });
    }

    const { lat, lon } = position;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum,temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,relative_humidity_2m_min&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch Open-Meteo");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
  }
}
